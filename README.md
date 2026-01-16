# CivEmulator by DeadDuckies

## Roster:
- PM: James Lei
- dev1: Kiran Soemardjo
- dev2: Sarah Zou
- dev3: Emaan Asif

## Description:
We made a dumbed-down version of Civilization 6 with its city-building and tile-based expansion systems combined with a simplified research and technology progression system inspired by Hearts of Iron IV. Games will occur between two players in a lobby with a pregenerated map and spawn points opposite each other. Players take turns buying tiles, developing research and technology, constructing resource improvements and districts, pillaging each other’s tiles while managing resources.

## Install Guide
Prerequisites
- python3 installed
- git installed

Click the green button on the repo, and choose the SSH clone option. Copy the link and open a terminal session. 
```
$ git clone git@github.com:JamesLNY/dead-duckies-p02.git
$ cd dead-duckies-p02
$ python -m venv venv
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
In terminal, access directory where project is stored and run the command:

```
~$ cd dead-duckies-p02/app
~$ python build_db.py
~$ python __init__.py
```
