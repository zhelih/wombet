val new_game : string list -> string option -> string option -> int
val vote: int -> string -> int -> unit
val record_start: int -> unit
val update_scoreboard: int -> int -> unit
val call: int -> int -> unit
val edit_score: string -> float -> unit
val scoreboard: string option -> Shared.scoreboard
val str_stats: unit -> string
val game: int -> ?admin:bool -> string option -> Shared.gameton
val games_list: string option -> Shared.gamelist
val tournaments: unit -> string list
val remove: int -> unit
val replace_url: int -> string -> unit
