run `.rulesync/commands/rebase.md`
then soft reset the feature branch to the current origin/dev HEAD
inspect all the changes for this feature branch and regroup the commits topically, avoiding an excessive number of commits
force push to the remote branch

!IMPORTANT! never force push to the `main`, `dev`, or any repository-noted production branches, only feature branches
