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
    * params: players, <tm>, <url>
    * return: game id and key JSON
    * action: add game with players, tournament, and URL
  * /vote
    * params: user, id, player
    * return: none
    * action: vote for a player as user
  * /start
    * params: key
    * return: none
    * action: stop voting ("start" game)
  * /call
    * params: key, player
    * return: none
    * action: call winner
  * /game
    * params: id, <user>
    * return: game JSON
    * action: get game info for a user if specified
	* /admingame
		* params: key
		* return: game JSON
		* action: get full game info
  * /list
    * params: <user>
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
