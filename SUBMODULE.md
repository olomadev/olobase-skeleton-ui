
## Submodule Init

If you have already cloned a repository and want to load its submodules:

In your project root:

```sh
cd /olobase-skeleton-ui
git submodule update --init --recursive --remote
```

## If You Want Upgrade to New Version of olobase-admin

https://stackoverflow.com/questions/791959/download-a-specific-tag-with-git

Checkout to a version.

```sh
cd packages/admin
git tag -l

1.3.2
1.3.3
1.3.4
2.0-alpha
2.0-beta
2.0
(END)
```

```sh
git checkout tags/2.0
```

or

```sh
git pull origin 1.3.0
git checkout 1.3.0
```


## If You Edited Submodule and You Want to Restore

```sh
git stash
git restore .
// HEAD detached at 1.2.0
```

## Updating Submodule

```sh
git submodule update --recursive --remote
```

Pull the version you want

```sh
cd packages/admin
git checkout 1.3.0
```

## Adding/ReInstalling a Submodule - (olobase-admin)

Remove packages/ line from your .gitignore file

```sh
.DS_Store
lib
dist
/node_modules/
packages/
```

Add admin submodule

```sh
git submodule add git@github.com:olomadev/olobase-admin.git packages/admin
```

Add packages/ line again.

```sh
.DS_Store
lib
dist
/node_modules/
packages/
```

### List Submodules

```sh
git config --file .gitmodules --name-only --get-regexp path

submodule.packages/admin.path
```

## Removing olobase-admin Submodule

```sh
git rm packages/admin
git commit & push
```

More details

https://stackoverflow.com/questions/1260748/how-do-i-remove-a-submodule

## Updating Submodule Branch

```sh
$ cat .gitmodules

[submodule "packages/admin"]
	path = packages/admin
	url = git@github.com:olomadev/olobase-admin.git
	branch = main
```

Change the branch

```sh
[submodule "packages/admin"]
	path = packages/admin
	url = git@github.com:olomadev/olobase-admin.git
	branch = 2.0
```


