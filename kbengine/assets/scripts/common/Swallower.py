# -*- coding: utf-8 -*-

class Swallower(object):

    def __init__(self, *args, **kwargs):
        pass

    def __getattr__(self, name):
        return self

    def __call__(self, *args, **kwargs):
        return self

    def __add__(self, other):
        return 0

    def __sub__(self, other):
        return self

    def __mul__(self, other):
        return 1

    def __div__(self, other):
        return 1

    def __getitem__(self, index):
        return self

    def __neg__(self):
        return -1

    def __iter__(self):
        return self

    def next(self):
        raise StopIteration()


class NonexistentSwallower(Swallower):

    def __nonzero__(self):
        return False


def DO_NOTHING(*arg, **kwargs):
    pass