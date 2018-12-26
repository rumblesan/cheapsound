import pynvim

import json
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError


@pynvim.plugin
class Main(object):
    def __init__(self, vim):
        self.vim = vim

    def message(self, message):
        self.vim.out_write("%s\n" % message)

    def handle_response(self, response, cb=None):
        if cb:
            cb(response)
        else:
            self.message(response.read())

    def interact(self, endpoint, body=str.encode(""), cb=None):
        try:
            url = "http://%s:%s%s" % (
                self.vim.vars['cheapsound_host'],
                self.vim.vars['cheapsound_port'],
                endpoint
            )
            req = Request(url)
            req.add_header('Content-Type', 'text/cheapsound')
            resp = urlopen(req, body)
            self.handle_response(resp, cb)
        except URLError as e:
            self.vim.err_write("URL Error: %s\n" % str(e.reason))
        except HTTPError as e:
            self.vim.err_write("HTTP Error: %s\n" % str(e.code))

    @pynvim.function('CheapSoundSend', range=True)
    def cheapsoundSend(self, args, range):
        self.message('range {}'.format(range))
        text = ''
        if range[0] == range[1]:
            text = str.encode(self.vim.current.buffer[range[0]-1])
        else:
            text = str.encode("\n".join(self.vim.current.buffer[range[0]-1:range[1]]))
        self.message('Sending {} to CheapSound'.format(text))
        self.interact("/run", body=text)
