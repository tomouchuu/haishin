# Haishin 配信

[![Build backend docker image](https://github.com/tomouchuu/haishin/actions/workflows/docker-backend.yml/badge.svg)](https://github.com/tomouchuu/haishin/actions/workflows/docker-backend.yml)
[![Build frontend docker image](https://github.com/tomouchuu/haishin/actions/workflows/docker-frontend.yml/badge.svg)](https://github.com/tomouchuu/haishin/actions/workflows/docker-frontend.yml)

This website is able to take a stream url or an mp4 file and then transcribe what was said in Japanese and then translate it into English. It does this by splitting the file or stream into chunks and sends these to OpenAI's whisper model for transcribing and then it sends this transcription to DeepL for translation. Presently it'll send a request at every few seconds to get the latest things that were said after an initial short buffer period.

It's certainly not perfect but hopefully it's enough for English speakers to understand the context around streams.

## In Progress
- Deployment, currently with beta testers so please wait for now

## TODOs

- Can we improve translations? I think we can do something about the sentences etc. sent to deepL
- Should it be possible to save the textLog for the user (They could just copy and paste I guess.)
- Can we not use the best preset so we can save on filesize
- Can we pull in comments + gifts from livestreams?
- Can we add auth so you could comment directly from here? Also might handle [#3 Twitcasts that require an account](https://github.com/tomouchuu/haishin/issues/3)

## Local Use

For starters grab API keys for [OpenAi](https://platform.openai.com/) + [DeepL](https://www.deepl.com/pro-api). Then clone the repo to your local machine and once downloaded copy `.env.example` to `.env` and fill it out with your OpenAi and DeepL api keys.

If using [Docker](https://www.docker.com/), you _should_ be able to run `docker-compose build` within the repo folder and then `docker-compose up` to start.

If not using Docker then the instructions below are for you!

1. You'll also need [nodejs](https://nodejs.org/en), [ffmpeg](https://ffmpeg.org/download.html), [streamlink](https://streamlink.github.io/install.html) and [pnpm](https://pnpm.io/installation) to be available in your command line.
2. Run `pnpm i` within the repo folder to install more dependencies.
3. Now you should be able to run `pnpm run faker` to start the dev servers which is enough to get started. Once started you should be able to go to http://localhost:3000 to see the site.
4. If you wish to run the site with actual transcriptions and translations then run `pnpm run dev`.

OpenAI gives you $5 to use for the first few months after signing up. I _think_ you can just keep creating accounts to get more. You'll be spending $0.006 a minute with OpenAI so a 1 hour stream will cost you ~$0.36 meaning you can watch just under 14 hours of streams with the free $5 you are given.

DeepL has a free allowance of 500,000 characters a month. It seems plenty fine!
