// scripts/build-exe.js - Compiles QueensDomain.exe using Windows built-in csc.exe compiler
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const csc = 'C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe';

if (!fs.existsSync(csc)) {
  console.error('csc.exe not found at', csc);
  process.exit(1);
}

const csharpSource = `
using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Threading;
using System.Windows.Forms;

namespace QueensDomainLauncher
{
    static class Program
    {
        private static Process serverProcess = null;

        [STAThread]
        static void Main(string[] args)
        {
            string appDir = AppDomain.CurrentDomain.BaseDirectory;
            string serverScript = Path.Combine(appDir, "server", "server.js");

            if (!File.Exists(serverScript))
            {
                // Fallback if inside a subfolder
                string subScript = Path.Combine(appDir, "ai-game-studio-main", "server", "server.js");
                if (File.Exists(subScript)) {
                    serverScript = subScript;
                    appDir = Path.Combine(appDir, "ai-game-studio-main");
                }
                else
                {
                    MessageBox.Show("Could not find server\\\\server.js in " + appDir, "Queen's Domain Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    return;
                }
            }

            // Check if server is already running on 47831
            bool alreadyRunning = IsPortInUse(47831);
            if (!alreadyRunning)
            {
                string nodePath = FindNode();
                if (string.IsNullOrEmpty(nodePath))
                {
                    DialogResult res = MessageBox.Show(
                        "Node.js 18+ is required to run Queen's Domain.\\n\\nWould you like to open nodejs.org to install it?",
                        "Node.js Not Found",
                        MessageBoxButtons.YesNo,
                        MessageBoxIcon.Warning
                    );
                    if (res == DialogResult.Yes)
                    {
                        Process.Start("https://nodejs.org/en/download");
                    }
                    return;
                }

                ProcessStartInfo psi = new ProcessStartInfo();
                psi.FileName = nodePath;
                psi.Arguments = "\\"" + serverScript + "\\"";
                psi.WorkingDirectory = appDir;
                psi.CreateNoWindow = true;
                psi.UseShellExecute = false;
                psi.WindowStyle = ProcessWindowStyle.Hidden;

                try
                {
                    serverProcess = Process.Start(psi);
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Failed to start server: " + ex.Message, "Launch Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    return;
                }

                // Wait up to 3 seconds for port to open
                for (int i = 0; i < 30; i++)
                {
                    Thread.Sleep(100);
                    if (IsPortInUse(47831)) break;
                }
            }

            // Parse launcher command arguments
            bool spawnMode = false;
            string spawnUrl = "https://www.spawn.co";

            foreach (string arg in args)
            {
                if (arg == "--spawn" || arg == "-s")
                {
                    spawnMode = true;
                }
                else if (arg.StartsWith("--spawn-url="))
                {
                    spawnMode = true;
                    spawnUrl = arg.Substring("--spawn-url=".Length).Trim();
                }
            }

            // Launch browser in app mode
            if (spawnMode)
            {
                LaunchBrowser("http://127.0.0.1:47831/?tab=spawnbrowser");
                LaunchBrowser(spawnUrl);
            }
            else
            {
                LaunchBrowser("http://127.0.0.1:47831/");
            }
        }

        static bool IsPortInUse(int port)
        {
            try
            {
                HttpWebRequest req = (HttpWebRequest)WebRequest.Create("http://127.0.0.1:" + port + "/");
                req.Timeout = 400;
                req.Method = "GET";
                using (HttpWebResponse resp = (HttpWebResponse)req.GetResponse())
                {
                    return resp.StatusCode == HttpStatusCode.OK;
                }
            }
            catch
            {
                return false;
            }
        }

        static string FindNode()
        {
            string[] paths = {
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "nodejs", "node.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "nodejs", "node.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Programs", "node", "node.exe")
            };

            foreach (string p in paths)
            {
                if (File.Exists(p)) return p;
            }

            // Try PATH
            string pathEnv = Environment.GetEnvironmentVariable("PATH") ?? "";
            foreach (string dir in pathEnv.Split(';'))
            {
                try
                {
                    string candidate = Path.Combine(dir.Trim(), "node.exe");
                    if (File.Exists(candidate)) return candidate;
                }
                catch { }
            }

            return null;
        }

        static void LaunchBrowser(string url)
        {
            string edge = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "Microsoft", "Edge", "Application", "msedge.exe");
            if (!File.Exists(edge))
            {
                edge = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "Microsoft", "Edge", "Application", "msedge.exe");
            }

            string chrome = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "Google", "Chrome", "Application", "chrome.exe");
            if (!File.Exists(chrome))
            {
                chrome = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "Google", "Chrome", "Application", "chrome.exe");
            }

            if (File.Exists(edge))
            {
                Process.Start(edge, "--app=\\"" + url + "\\"");
            }
            else if (File.Exists(chrome))
            {
                Process.Start(chrome, "--app=\\"" + url + "\\"");
            }
            else
            {
                Process.Start(url);
            }
        }
    }
}
`;

const csFile = path.join(root, 'scripts', 'Launcher.cs');
const exeFile = path.join(root, 'QueensDomain.exe');

fs.writeFileSync(csFile, csharpSource);

console.log('Compiling QueensDomain.exe...');
try {
  execFileSync(csc, [
    '/target:winexe',
    '/platform:anycpu',
    '/optimize+',
    '/out:' + exeFile,
    '/reference:System.dll,System.Windows.Forms.dll,System.Drawing.dll',
    csFile
  ], { stdio: 'inherit' });
  console.log('Successfully compiled:', exeFile);
} catch (err) {
  console.error('Compilation failed:', err);
  process.exit(1);
} finally {
  if (fs.existsSync(csFile)) fs.unlinkSync(csFile);
}
