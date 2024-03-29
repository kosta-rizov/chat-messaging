import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { id: idToAdd } = z.object({ id: z.string() }).parse(body)

    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

     // check if users are alrady friends
    const isAlreadyFriends = await fetchRedis(
      'sismember',
      `user:${session.user.id}:friends`,
      idToAdd
    )
    
    // If Already friends
    if (isAlreadyFriends) {
      return new Response('Already friends', { status: 400 })
    }

    // incoming friend requests
    const hasFriendRequest = await fetchRedis(
      'sismember',
      `user:${session.user.id}:incoming_friend_requests`,
      idToAdd
    )
    
    if (!hasFriendRequest) {
      return new Response('No friend request', { status: 400 })
    }

    // add user as friend
    await db.sadd(`user:${session.user.id}:friends`, idToAdd)
    // add user to the requester's friend list, both users are friends
    await db.sadd(`user:${idToAdd}:friends`, session.user.id)
    // remove friend request
    await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd)


    return new Response('OK')

  } catch (error) {

    if (error instanceof z.ZodError) {
      return new Response('Invalid request', { status: 422 })
    }

    return new Response('Invalid request', { status: 400 })
  }
}