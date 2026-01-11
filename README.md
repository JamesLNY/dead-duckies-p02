# CivEmulator by DeadDuckies

## Roster:
- PM: James Lei
- dev1: Kiran Soemardjo
- dev2: Sarah Zou
- dev3: Emaan Asif

## Description:
We will be making a dumbed-down version of Civilization 6 combined with the research and focus systems of Hearts of Iron IV. Games will occur between two players on a pregenerated map. Players can build units, improve their empire, and research technologies with the goal of killing the other player or finishing the technology tree.

## Install Guide
Prerequisites
- python3 installed
- git installed

Click the green button on the repo, and choose the SSH clone option. Copy the link and open a terminal session. 
```
$ git clone git@github.com:JamesLNY/dead-duckies-p02.git
$ cd dead-duckies-p02
$ python -m venv ~venv
```
For Linux and Mac users

```
$ source venv/bin/activate
$ pip install -r requirements.txt
```

For Windows users

```
$ venv\Scripts\activate
$ pip install -r requirements.txt
```
## Launch Codes:
In terminal, access project root directory and run the command:

```
~$ cd app
~$ python build_db.py
~$ python __init__.py
```