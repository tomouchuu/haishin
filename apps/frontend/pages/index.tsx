import type { NextPage } from 'next'

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface HomeProps {
  version: string
}

export async function getStaticProps() {
  const version = process.env.HAISHIN_VERSION ?? 'dev'

  return {
    props: {
      version: version
    }
  }
}

const Home: NextPage<HomeProps> = (props) => {
  const [streamUrl, updateStreamUrl] = useState('')
  const [cleanStreamUrl, updateCleanStreamUrl] = useState('')

  useEffect(() => {
    const cleanUrl = encodeURIComponent(streamUrl)
    updateCleanStreamUrl(cleanUrl)
  }, [streamUrl])

  return (
    <div className="flex flex-col min-h-screen max-w-screen-md px-2 mx-auto">
      <h1 className="text-4xl text-center py-8">
        Haishin
        <small className="block text-xl">- 配信 -</small>
      </h1>
      <p>This tool is able to take a stream url or an mp4 file and then transcribe what was said in Japanese and then translate it into English. It does this by splitting the file or stream into chunks and sends these to OpenAI&apos;s whisper model for transcribing and then it sends this transcription to DeepL for translation.</p>
      <p className="my-2">Presently you&apos;ll get a new a new transcription and translation every few seconds for a livestream.</p>
      <p>The tool is not perfect, transcriptions may miss or make mistakes which causes a knock on effect for translations. But it should be good enough for English speakers to understand the gist of streams.</p>

      <section className="mt-6">
        <h3 className="text-2xl">Livestreams</h3>
        <form className="flex my-4">
          <label className="relative flex-1">
            <span className="sr-only">URL</span>
            <input className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md p-2 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder="Stream url" type="url" name="streamUrl" onChange={(e) => { updateStreamUrl(e.target.value) }}/>
          </label>
          <Link href={`/stream/${cleanStreamUrl}`} className='ml-4 px-8 py-2 text-white rounded bg-sky-600 hover:bg-sky-700'>Submit</Link>
        </form>

        <div className="text-center">
          <p>Currently known supported sites: <i>Youtube</i>, <i>Twitch</i> and <i>Twitcasting</i>.</p>
          <p className="text-sm"><i className="line-through">Showroom</i> (only works when running Haishin locally under VPN)</p>
          <p>Anything supporting <a className="underline" href="https://streamlink.github.io/">Streamlink</a> <i>should</i> work</p>
        </div>
      </section>

      <div className="my-8">
        <hr />
        <div className="text-center -mt-3">
          <p className="px-4 bg-white inline-block">OR</p>
        </div>
      </div>

      <section>
        <h3 className="text-2xl">Archives <small>(uploads)</small></h3>
        <form action="/api/stream/upload" method="post" encType="multipart/form-data" className="flex my-4">
          <label className="relative flex-1">
            <span className="sr-only">File</span>
            <input className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md p-2 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" type="file" name="file" />
          </label>
          <button type="submit" className="ml-4 px-8 py-1 text-white rounded bg-sky-600 hover:bg-sky-700">Upload</button>
        </form>
      </section>

      <footer className="mt-auto pt-4 py-2 text-center text-sm">
        <p className="flex place-content-center">
          <a className="place-self-end" href="https://github.com/tomouchuu/haishin">Github</a>
          <span className="flex-none mx-2">|</span>
          <span className="place-self-start">
            {props.version.slice(0, 7)}
          </span>
        </p>
        <p className="text-xs">Built by <a href="https://tomo.uchuu.io">Thomas(tomouchuu)</a></p>
      </footer>
    </div>
  )
}

export default Home
