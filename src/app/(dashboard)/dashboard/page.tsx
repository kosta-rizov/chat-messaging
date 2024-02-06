import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const Dashboard = async () => {

  const session = await getServerSession(authOptions)
  console.log("🚀 ~ Dashboard ~ session:", session)

  return (
    <div>
      dashboard
      {JSON.stringify(session)} 
    </div>
  )
}

export default Dashboard