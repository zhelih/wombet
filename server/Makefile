.SUFFIXES:
.PHONY: build clean opam

build:
	dune build @all && echo ""

clean:
	dune clean

deps:
	opam install dune devkit yojson ppx_deriving ppx_deriving_yojson
