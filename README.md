# Daymark — DeployMe static-site demo

Standalone productivity dashboard built with HTML, CSS and vanilla JavaScript. Includes task creation, completion, filters, theme switching and localStorage persistence.

## Local preview
Open `index.html` in your browser, or serve this folder with any local static HTTP server. No installation or build is needed.

## DeployMe settings
| Setting | Value |
| --- | --- |
| Root directory | `.` |
| Install command | *(empty)* |
| Build command | *(empty)* |
| Output directory | `.` |
| SPA fallback | `false` |

## Manual verification
- Add a task, mark it complete and filter the list.
- Reload the page; verify tasks persist.
- Switch themes, reload and verify the selected theme persists.
- Check a narrow mobile viewport and keyboard focus controls.

## Publishing
Create an empty GitHub repo named `deployme-daymark`. In Git Bash, from this extracted folder, run:

```bash
bash publish.sh https://github.com/YOUR_USERNAME/deployme-daymark.git
```
