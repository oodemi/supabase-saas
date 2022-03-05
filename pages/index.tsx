import type { NextPage } from 'next'
import { supabase } from '../utils/supabase'
import Link from 'next/link'
import { Lesson } from '../type'
import { useUser } from '../context/user'

type Props = {
  lessons: Lesson[]
}

const Home: NextPage<Props> = ({ lessons }) => {
  const { user } = useUser()
  console.log(user);

  return (
    <div className="mx-auto my-16 w-full max-w-3xl px-2">
      {lessons.map((lesson) => (
        <Link key={lesson.id} href={`/${lesson.id}`}>
          <a className="mb-4 flex h-40 rounded p-8 text-xl shadow">
            {lesson.title}
          </a>
        </Link>
      ))}
    </div>
  )
}

export default Home

export const getStaticProps = async () => {
  const { data: lessons } = await supabase.from('lesson').select('*')

  return {
    props: {
      lessons,
    },
  }
}
