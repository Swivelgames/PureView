#!/bin/bash

[ $# -eq 0 ] && { echo "Usage: $0 new_version_number"; exit 128; }

NVERSION=$1
CANDIDATE="false"
[ $# -eq 2 ] && {
	CANDIDATE=$2;
	NVERSION="$1rc$2"
}

# HUGE thanks to Dave Dopson FOR http://stackoverflow.com/questions/59895/can-a-bash-script-tell-what-directory-its-stored-in
SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  BIN_DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$BIN_DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
BIN_DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
GIT_DIR="$(git rev-parse --show-toplevel)"

#THIS_SCRIPT="$DIR/${SOURCE##*/}"; #NO LONGER NECESSARY, SINCE ALL SCRIPTS ARE IN THE BIN DIRECTORY...

cd $GIT_DIR

RELEASE_BRANCH="release-$NVERSION"

git checkout develop
git tag -a "develop-$NVERSION" -m "Development release for $NVERSION"
wait $!
git checkout -b $RELEASE_BRANCH
$BIN_DIR/compile.sh
wait $!
git rm -f "$GIT_DIR/view-model-prop.js" "$GIT_DIR/view-model.js" "$GIT_DIR/view.js"
git rm -r -f $BIN_DIR
git add "$GIT_DIR/pure-view.min.js"
git commit -m "AUTO: Compiled and prepared repository for $NVERSION release"
if [ "$CANDIDATE" == "false" ]; then
	git checkout master;
	git merge --no-ff -m "AUTO: Merging $RELEASE_BRANCH branch for version $NVERSION" $RELEASE_BRANCH -X theirs;
	git branch -D $RELEASE_BRANCH;
fi
git tag -a $NVERSION
wait $!
git checkout develop
git submodule init
git submodule update