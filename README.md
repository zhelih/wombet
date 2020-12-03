# wombet

Server start options:
  * -loglevel       ([<facil|prefix*>=]debug|info|warn|error[,])+
  * -logfile <file> Log file (default: none)
  * -pidfile <file> PID file (default: none)
  * -runas <user>   run as specified user
  * -fg             Stay in foreground
  * -help           Display this list of options
  * --help          Display this list of options

Server queries:
  * /add
    * params: userA, userB, url
    * return: game id
    * action: add game
  * /vote
    * params: user, id, aorb
    * return: none
    * action: vote for a player
  * /start
    * params: id
    * return: none
    * action: stop voting ("start" game)
  * /call
    * params: id, aorb
    * return: none
    * action: call winner
  * /game
    * params: id
    * return: game JSON
    * action: get game info
  * /list
    * params: none
    * return: game list JSON
    * action: get all games info
  * /scoreboard
    * params: none
    * return: scoreboard JSON
    * action: get current scoreboard
  * /edit
    * params: user, score
    * return: none
    * action: edit score for a user in scoreboard
  * /stats
    * params: none
    * return: server stats TEXT
    * action: get stats
