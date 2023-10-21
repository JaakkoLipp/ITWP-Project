# ITWP Project Report

---

This project aims to build a fully functional platformer-type game in Phaser 3, where the main objective is to collect as much score as possible in the given time frame. Score can be acquired by shooting enemies and  The game features interactable enemies and two types of collectible stars, which have 2 different rarity tiers and give different score.

A timer is added to provide the player incentive to move a bit faster and take more risks for a better score. The score is then displayed on a scoreboard below the game on the web page. More on features below and in pointsproposal.

### Links to hosted version and github repository

---

[](https://itwp-project-jl.duckdns.org/)

[https://github.com/JaakkoLipp/ITWP-Project](https://github.com/JaakkoLipp/ITWP-Project)

# Highlighted Features, Notes & Instructions

---

- Controls:
    - Move with arrow keys
    - To jump press arrow up
    - Shoot and aim with mouse
- Hosted on a live web server
- Using Week 7 codebase
- Persistent scoreboard
    - Persistent name storage reload **is not active in hosted** **version**, because it is publicly accessible by anyone
- While NameInput is in use, game controls do not conflict. click outside the nameInput field to control the game.
- Texture for enemies is from here [https://0x72.itch.io/dungeontileset-ii](https://0x72.itch.io/dungeontileset-ii?download)

# Project Points

---

**Feature**

**Proposed points**

| Game is hosted on a public web server, using nginx, and accessible with domain name URL and  | 5 |
| --- | --- |
| Persistent scoreboard stored in local storage + hidden function to clear scoreboard. ( clearScoreboard() ) | 3 |
| Well written PDF report / readme | 3 |
| Application works on Firefox, Edge and Chrome | 3 |
| There is a clear plot in the game. It has a start and end. (Time trial) | 3 |
| User can get their name in the scoreboard Top 5 | 3 |
| Gamer needs to use both keyboard (movement) and mouse (aim and shoot) to meaningfully control the character | 3 |
| Game uses physics engine, so that there are falling parts / enemies / players | 2 |
| There are enemies that can hurt the player (restarting the game) | 3 |
| The application has clear directory structure and everything is organized well | 2 |
| There are different (more than 1) objects to collect | 2 |
| Bullets have slight bullet drop physics | 2 |
| CSS: Game and scoreboard are centered on the page, with GitHub icon at bottom corner, dark background. | 2 |
| Timer and a timer display | 2 |
| Randomized spawning of enemies | 1 |
| Alerts to show points if dead or time runs out | 1 |
| Total | 40 |