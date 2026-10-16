# GitHub Actions execution guide
Status: workflow sources prepared; all GitHub execution evidence pending.
Run from a terminal on your own machine with Git and GitHub CLI installed.
Never paste credentials into this document or chat.

## Repository creation
From actions-main:
```bash
gh auth status
npm install --package-lock-only
git init -b main
git add .
git commit -m "Add activity workflows"
gh repo create devops-actions-49085 --public --source=. --remote=origin --push
gh variable set APP_NAME --body 'Dilawar DevOps Lab'
gh secret set MY_SECRET
```
For MY_SECRET enter a disposable classroom-only value at the interactive prompt.
The secret workflow intentionally prints this disposable value to demonstrate masking.
Inspect Settings > Actions > General: actions/reusable-workflow policy and workflow permissions.
Capture the full browser window with address bar and logged-in identity.
Explicit workflow permissions request write access only in the token demonstration.

## Push and PR
```bash
git switch -c dev
git commit --allow-empty -m "Demonstrate dev push and PR"
git push -u origin dev
gh pr create --base main --head dev --title 'Activity event demonstration' --body 'Trigger the pull_request workflow.'
git switch main
gh workflow run 01-events.yml -f name='Dilawar Khalid' -f greeting=Hello -f data=49085
gh workflow run 02-secrets.yml
gh workflow run 03-platforms.yml
gh workflow run 04-matrix.yml
gh workflow run 05-services.yml
gh run list
```
Also run 01-events manually in the web interface and capture its populated form.
After matrix completes successfully, run it a second time for cache restoration evidence.
The schedule runs only from the default branch and can be delayed; a manual run is not schedule proof.
Disable the frequent schedule after capturing the genuine Scheduled run.

## External dispatch using curl and PAT
Use a fine-grained PAT limited to this repository with Contents write permission.
Enter it hidden; do not enable shell tracing. Run in Bash:
```bash
REPO=$(gh repo view --json nameWithOwner --jq .nameWithOwner)
read -rsp 'Disposable PAT: ' ACTIVITY_PAT; echo
printf 'header = "Authorization: Bearer %s"\n' "$ACTIVITY_PAT" | curl --config - --silent --show-error --output /dev/null --write-out 'HTTP %{http_code}\n' --request POST --header 'Accept: application/vnd.github+json' --header 'X-GitHub-Api-Version: 2022-11-28' "https://api.github.com/repos/$REPO/dispatches" --data '{"event_type":"custom-webhook","client_payload":{"sap":"49085"}}'
unset ACTIVITY_PAT
```
Expected successful acceptance: HTTP 204. Verify a real repository_dispatch run afterward.

## Self-hosted runner
On your Linux x64 computer, open Settings > Actions > Runners > New self-hosted runner.
Follow the current download and checksum instructions displayed by GitHub.
Register with the custom label dilawar-lab, then start ./run.sh.
Keep this process active, capture Online/Idle in Settings, and manually run 06-self-hosted.yml.
This workflow is manual-only and does not check out repository code. Review the repository
before registering a machine; do not run untrusted pull-request code on it.
If your machine is not Linux x64, adjust the workflow labels to match the actual runner.
Remove the runner registration after completing the class lab if no longer needed.

## Dedicated JavaScript action repository
From ../custom-action:
```bash
npm install
npm run build
git init -b main
git add .
git commit -m "Release compiled greeting action"
gh repo create devops-custom-action-49085 --public --source=. --remote=origin --push
git tag v1.0.0
git push origin v1.0.0
```
Confirm dist/index.js and package-lock.json are committed. In actions-main, replace
REPLACE_OWNER in 07-custom.yml.template with the real owner and rename to 07-custom.yml.
Commit, push, run the workflow, and capture the greeting and repository tree.
Do not mark this complete until compilation, release and invocation all succeed.
