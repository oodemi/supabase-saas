import { supabase } from '../utils/supabase'
import { Lesson } from '../type'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'

type Data = {
  lessons: Lesson[]
}

type Props = {
  lesson: Lesson
}

const LessonDetails: NextPage<Props> = ({ lesson }) => {
  const [videoUrl, setVideoUrl] = useState()

  const getPremiumContent = async () => {
    const { data } = await supabase
      .from('premium_content')
      .select('video_url')
      .eq('id', lesson.id)
      .single()

    setVideoUrl(data?.video_url)
  }

  useEffect(() => {
    getPremiumContent()
  }, [])

  return (
    <div className="mx-auto w-full max-w-3xl py-16 px-8">
      <h1 className="mb-6 text-3xl">{lesson.title}</h1>
      <p>{lesson.description}</p>
      {!!videoUrl && <ReactPlayer url={videoUrl} width="100%" />}
    </div>
  )
}

export const getStaticPaths = async () => {
  const { data: lessons }: any = await supabase.from('lesson').select('id')

  const paths = lessons.map(({ id }) => ({
    params: {
      id: id.toString(),
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps = async ({ params: { id } }) => {
  const { data: lesson }: any = await supabase
    .from('lesson')
    .select('*')
    .eq('id', id)
    .single()

  return {
    props: {
      lesson,
    },
  }
}

export default LessonDetails
