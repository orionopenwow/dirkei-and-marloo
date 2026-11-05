// ==UserScript==
// @name         Queen's Domain — Spawn.co Agent Companion & GLB Bridge
// @namespace    https://github.com/orionopenwow/queens-domain
// @version      1.0.0
// @description  Bridges Spawn.co games with Queen's Domain local AI agent: live GLB extraction & insertion, runtime engine hot-patching, pack scanner, and in-game floating agent chat HUD.
// @author       Queen's Domain Architecture Lab
// @match        https://www.spawn.co/*
// @match        https://spawn.co/*
// @match        http://localhost:*/*
// @match        http://127.0.0.1:*/*
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      127.0.0.1
// @connect      localhost
// @run-at       document-idle
// ==/UserScript==

(function() {
  'use strict';

  const QD_HOST = 'http://127.0.0.1:47831';
  let isConnected = false;
  let activeScene = null;
  let pollInterval = null;
  let isExpanded = false;

  console.log("%c👑 Queen's Domain Spawn Companion Loaded", "background:#00f0ff;color:#000;font-weight:bold;padding:4px 8px;border-radius:4px;");

  // Helper for cross-origin or local requests using GM_xmlhttpRequest or fetch
  function qdRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
      const url = `${QD_HOST}${path}`;
      const hasGM = typeof GM_xmlhttpRequest !== 'undefined';
      if (hasGM) {
        GM_xmlhttpRequest({
          method: method,
          url: url,
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'QueensDomainCompanion'
          },
          data: data ? JSON.stringify(data) : null,
          onload: function(res) {
            try {
              resolve(JSON.parse(res.responseText));
            } catch (e) {
              resolve({ ok: res.status >= 200 && res.status < 300, text: res.responseText });
            }
          },
          onerror: function(err) { reject(err); }
        });
      } else {
        fetch(url, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: data ? JSON.stringify(data) : undefined
        }).then(r => r.json()).then(resolve).catch(reject);
      }
    });
  }

  // Detect Three.js / Savi scene in window or canvas
  function findThreeScene() {
    if (window.THREE && window.THREE.Scene) {
      if (window.__THREE_SCENE__) return window.__THREE_SCENE__;
      if (window.scene && window.scene.isScene) return window.scene;
    }
    // Search window properties
    for (const k of Object.keys(window)) {
      try {
        const v = window[k];
        if (v && typeof v === 'object' && v.isScene) {
          activeScene = v;
          return v;
        }
      } catch (e) {}
    }
    return activeScene;
  }

  // Scan Scene Entities & Assets
  function scanScene() {
    const scene = findThreeScene();
    if (!scene) {
      return {
        entityCount: 0,
        meshCount: 0,
        meshes: [],
        textures: [],
        audio: []
      };
    }

    const meshes = [];
    const textures = new Set();
    let entityCount = 0;

    scene.traverse(obj => {
      entityCount++;
      if (obj.isMesh) {
        meshes.push({
          name: obj.name || `Mesh_${meshes.length + 1}`,
          type: obj.type,
          triangles: obj.geometry && obj.geometry.index ? obj.geometry.index.count / 3 : 0,
          hasMaterial: !!obj.material,
          visible: obj.visible
        });
        if (obj.material) {
          const mat = Array.isArray(obj.material) ? obj.material : [obj.material];
          mat.forEach(m => {
            if (m.map && m.map.name) textures.add(m.map.name);
          });
        }
      }
    });

    return {
      entityCount,
      meshCount: meshes.length,
      meshes: meshes.slice(0, 50),
      textures: Array.from(textures).slice(0, 20),
      audio: []
    };
  }

  // Build Floating Glassware HUD
  function createHUD() {
    if (document.getElementById('qd-in-game-hud')) return;

    const hud = document.createElement('div');
    hud.id = 'qd-in-game-hud';
    hud.style.cssText = `
      position: fixed;
      bottom: 18px;
      right: 18px;
      z-index: 999999;
      background: rgba(8, 10, 16, 0.92);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(0, 240, 255, 0.35);
      border-radius: 12px;
      box-shadow: 0 16px 40px rgba(0,0,0,0.8), 0 0 20px rgba(0,240,255,0.15);
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 12px;
      width: 320px;
      overflow: hidden;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      user-select: none;
    `;

    hud.innerHTML = `
      <div id="qd-hud-header" style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:rgba(255,255,255,0.03);border-bottom:1px solid rgba(255,255,255,0.08);cursor:pointer">
        <div style="display:flex;align-items:center;gap:8px">
          <div id="qd-status-dot" style="width:8px;height:8px;border-radius:50%;background:#f43f5e;box-shadow:0 0 8px #f43f5e"></div>
          <b style="font-size:12px;letter-spacing:0.04em;color:#ffffff">👑 QUEEN'S DOMAIN AGENT</b>
        </div>
        <button id="qd-hud-toggle" style="background:none;border:none;color:#a1a1aa;cursor:pointer;font-size:14px;padding:0 4px">▼</button>
      </div>

      <div id="qd-hud-body" style="padding:12px 14px;display:flex;flex-direction:column;gap:10px">
        <div style="display:flex;align-items:center;justify-content:space-between;font-size:11px;color:#a1a1aa">
          <span>Bridge: <b id="qd-status-text" style="color:#f43f5e">Disconnected</b></span>
          <span id="qd-entity-count" style="color:#38bdf8">Entities: 0</span>
        </div>

        <!-- Quick Action Toolbar -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
          <button id="qd-btn-extract-glb" style="padding:6px 8px;font-size:11px;font-weight:bold;background:rgba(0,240,255,0.12);border:1px solid rgba(0,240,255,0.3);border-radius:6px;color:#ffffff;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:4px">
            <span>📦</span> Extract GLB
          </button>
          <button id="qd-btn-insert-glb" style="padding:6px 8px;font-size:11px;font-weight:bold;background:rgba(251,191,36,0.12);border:1px solid rgba(251,191,36,0.3);border-radius:6px;color:#fbbf24;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:4px">
            <span>📥</span> Insert GLB
          </button>
          <button id="qd-btn-scan-packs" style="padding:6px 8px;font-size:11px;font-weight:bold;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#d4d4d8;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:4px">
            <span>🔍</span> Scan Packs
          </button>
          <button id="qd-btn-hot-patch" style="padding:6px 8px;font-size:11px;font-weight:bold;background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.3);border-radius:6px;color:#34d399;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:4px">
            <span>⚡</span> Hot Patch
          </button>
        </div>

        <!-- In-Game Agent Chat & Stream -->
        <div id="qd-chat-box" style="display:flex;flex-direction:column;gap:6px;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:8px;max-height:140px;overflow-y:auto">
          <div style="font-size:10.5px;color:#71717a">Agent active. Ask anything to modify the game live...</div>
        </div>

        <div style="display:flex;gap:6px">
          <input id="qd-chat-input" placeholder="Instruction to in-game agent..." style="flex:1;background:rgba(6,8,12,0.9);border:1px solid rgba(255,255,255,0.15);border-radius:6px;padding:6px 8px;color:#ffffff;font-size:11px;outline:none">
          <button id="qd-chat-send" style="padding:6px 12px;background:#00f0ff;border:none;border-radius:6px;color:#000;font-weight:bold;font-size:11px;cursor:pointer">Send</button>
        </div>
      </div>
    `;

    document.body.appendChild(hud);

    // Event Listeners
    const header = hud.querySelector('#qd-hud-header');
    const toggle = hud.querySelector('#qd-hud-toggle');
    const body = hud.querySelector('#qd-hud-body');

    header.onclick = () => {
      isExpanded = !isExpanded;
      body.style.display = isExpanded ? 'flex' : 'none';
      toggle.textContent = isExpanded ? '▲' : '▼';
    };
    body.style.display = 'flex'; // Start open

    // Extract GLB Button
    hud.querySelector('#qd-btn-extract-glb').onclick = async (e) => {
      e.stopPropagation();
      await triggerGlbExtraction();
    };

    // Insert GLB Button
    hud.querySelector('#qd-btn-insert-glb').onclick = async (e) => {
      e.stopPropagation();
      addChatMessage("Agent", "Requesting active protagonist GLB insertion from Queen's Domain library...");
      qdRequest('POST', '/api/spawn/bridge/insert-glb', {
        glbName: "Queen's Domain Guardian",
        position: [0, 1, 0]
      }).then(() => {
        addChatMessage("Agent", "Insertion queued. Downloading mesh into live scene...");
      }).catch(err => {
        addChatMessage("System", "Insert failed: " + err.message);
      });
    };

    // Scan Packs Button
    hud.querySelector('#qd-btn-scan-packs').onclick = (e) => {
      e.stopPropagation();
      const report = scanScene();
      addChatMessage("Scanner", `Scanned ${report.entityCount} entities, ${report.meshCount} meshes, ${report.textures.length} textures.`);
      sendHeartbeat();
    };

    // Hot Patch Button
    hud.querySelector('#qd-btn-hot-patch').onclick = (e) => {
      e.stopPropagation();
      const code = prompt("Enter JavaScript/TypeScript code to evaluate live in engine:", "console.log('Queen\\'s Domain Hot Patch Active');");
      if (code) {
        try {
          const res = eval(code);
          addChatMessage("Patch", "Executed successfully: " + String(res).slice(0, 100));
        } catch (err) {
          addChatMessage("Patch Error", err.message);
        }
      }
    };

    // Chat Send
    const chatInput = hud.querySelector('#qd-chat-input');
    const chatSend = hud.querySelector('#qd-chat-send');
    const onSend = async () => {
      const msg = chatInput.value.trim();
      if (!msg) return;
      chatInput.value = '';
      addChatMessage("You", msg);
      try {
        const res = await qdRequest('POST', '/api/spawn/bridge/agent-chat', {
          message: msg,
          worldUrl: window.location.href,
          sceneStats: scanScene()
        });
        if (res && res.reply) {
          addChatMessage("Agent", res.reply);
        }
      } catch (err) {
        addChatMessage("Agent", "Error connecting to local agent: " + err.message);
      }
    };
    chatSend.onclick = onSend;
    chatInput.onkeydown = (e) => { if (e.key === 'Enter') onSend(); };
  }

  function addChatMessage(author, text) {
    const box = document.getElementById('qd-chat-box');
    if (!box) return;
    const msg = document.createElement('div');
    msg.style.cssText = 'line-height:1.35;word-break:break-word;font-size:11px';
    const isUser = author === 'You';
    msg.innerHTML = `<b style="color:${isUser ? '#38bdf8' : author === 'Agent' ? '#fbbf24' : '#10b981'}">${author}:</b> <span style="color:#f4f4f5">${escapeHtml(text)}</span>`;
    box.appendChild(msg);
    box.scrollTop = box.scrollHeight;
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Trigger GLB Extraction from scene
  async function triggerGlbExtraction() {
    addChatMessage("System", "Extracting 3D meshes from live scene...");
    const scene = findThreeScene();
    if (!scene) {
      addChatMessage("System", "No active Three.js scene detected on page yet. Move camera or spawn a model first.");
      return;
    }

    try {
      // Dynamic GLTF Exporter injection if needed
      if (!window.THREE || !window.THREE.GLTFExporter) {
        await new Promise((res, rej) => {
          const s = document.createElement('script');
          s.src = 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/js/exporters/GLTFExporter.js';
          s.onload = res;
          s.onerror = () => rej(new Error('Could not load GLTFExporter'));
          document.head.appendChild(s);
        }).catch(() => null);
      }

      if (window.THREE && window.THREE.GLTFExporter) {
        const exporter = new window.THREE.GLTFExporter();
        exporter.parse(scene, (glbBuffer) => {
          const bytes = new Uint8Array(glbBuffer);
          let binary = '';
          for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const base64 = btoa(binary);
          const worldName = (document.title || 'spawn_world').replace(/[^a-zA-Z0-9_-]/g, '_');
          qdRequest('POST', '/api/spawn/bridge/extract-glb', {
            name: `${worldName}_extracted_${Date.now()}`,
            glbBase64: base64,
            worldUrl: window.location.href
          }).then(res => {
            addChatMessage("Agent", `Extracted GLB saved to Queen's Domain! (${Math.round(bytes.byteLength / 1024)} KB)`);
          }).catch(err => {
            addChatMessage("System", "Extraction upload failed: " + err.message);
          });
        }, { binary: true });
      } else {
        // Fallback: Serialize geometry metadata and request Queen's Domain compilation
        const stats = scanScene();
        qdRequest('POST', '/api/spawn/bridge/extract-glb', {
          name: `spawn_scene_manifest_${Date.now()}`,
          metadata: stats,
          worldUrl: window.location.href
        }).then(() => {
          addChatMessage("Agent", `Scanned & extracted ${stats.meshCount} mesh manifests into Queen's Domain.`);
        });
      }
    } catch (e) {
      addChatMessage("System", "Extraction error: " + e.message);
    }
  }

  // Handle incoming commands from Queen's Domain
  function handleCommand(cmd) {
    if (!cmd || !cmd.type) return;
    console.log("[Queen's Domain Command]", cmd);

    if (cmd.type === 'extract_glb') {
      triggerGlbExtraction();
    } else if (cmd.type === 'insert_glb') {
      addChatMessage("Agent", `Inserting model: ${cmd.glbName || 'GLB Model'} into live scene...`);
      // Inject model into scene using GLTFLoader
      try {
        if (window.THREE && window.THREE.GLTFLoader && cmd.glbUrl) {
          const loader = new window.THREE.GLTFLoader();
          loader.load(cmd.glbUrl, (gltf) => {
            const scene = findThreeScene();
            if (scene) {
              const mesh = gltf.scene || gltf.scenes[0];
              if (cmd.position) mesh.position.set(cmd.position[0], cmd.position[1], cmd.position[2]);
              scene.add(mesh);
              addChatMessage("Agent", `Successfully added ${cmd.glbName || 'model'} to world!`);
            }
          });
        }
      } catch (err) {
        addChatMessage("System", "Insert GLB failed: " + err.message);
      }
    } else if (cmd.type === 'inject_code') {
      addChatMessage("Agent", `Hot-patching engine code: ${cmd.title || 'Patch'}`);
      try {
        eval(cmd.code);
        addChatMessage("Agent", "Code hot-patch applied live!");
      } catch (err) {
        addChatMessage("System", "Hot-patch error: " + err.message);
      }
    } else if (cmd.type === 'agent_message') {
      addChatMessage("Agent", cmd.text);
    }
  }

  // Send Heartbeat & Scene State
  async function sendHeartbeat() {
    try {
      const sceneData = scanScene();
      const res = await qdRequest('POST', '/api/spawn/bridge/state', {
        worldUrl: window.location.href,
        worldTitle: document.title || 'Spawn Game',
        scene: sceneData
      });

      if (!isConnected) {
        isConnected = true;
        const dot = document.getElementById('qd-status-dot');
        const txt = document.getElementById('qd-status-text');
        if (dot) { dot.style.background = '#10b981'; dot.style.boxShadow = '0 0 10px #10b981'; }
        if (txt) { txt.textContent = 'Connected'; txt.style.color = '#10b981'; }
      }

      const entityEl = document.getElementById('qd-entity-count');
      if (entityEl) entityEl.textContent = `Entities: ${sceneData.entityCount}`;

      // Poll pending commands
      const pollRes = await qdRequest('GET', '/api/spawn/bridge/poll');
      if (pollRes && Array.isArray(pollRes.commands)) {
        pollRes.commands.forEach(handleCommand);
      }
    } catch (e) {
      if (isConnected) {
        isConnected = false;
        const dot = document.getElementById('qd-status-dot');
        const txt = document.getElementById('qd-status-text');
        if (dot) { dot.style.background = '#f43f5e'; dot.style.boxShadow = '0 0 8px #f43f5e'; }
        if (txt) { txt.textContent = 'Disconnected'; txt.style.color = '#f43f5e'; }
      }
    }
  }

  // Initialization
  function init() {
    createHUD();
    sendHeartbeat();
    pollInterval = setInterval(sendHeartbeat, 1500);
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    window.addEventListener('DOMContentLoaded', init);
  }
})();
