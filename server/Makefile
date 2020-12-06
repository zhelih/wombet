.SUFFIXES:
.PHONY: build clean opam

build:
	dune build @all

clean:
	dune clean

deps:
	opam install dune devkit yojson ppx_deriving
