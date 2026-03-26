import { useState } from "react"
import { Button } from "./Button";

export const Users = () => {

    const [users, setUsers] = useState([{
        firstName: "Rakesh",
        lastName: "Kumawath",
        _id: 1
    }]);
    return <div>
        <div className="font-bold mt-6 text-lg">
            Users
        </div>
        <div className="my-2">
            <input type="text" placeholder="Search users..."
            className="border w-full px-2 py-1 rounded border-slate-200"
            ></input>
        </div>
        <div>
            {users.map(user => <User user={user} />)}
        </div>
    </div>
}

const User = ({user}) => {
    return <div className="flex justify-between">
        <div className="flex">
            <div className="rounded-full bg-slate-200 h-12 w-12 flex justify-center mt-1 mr-2">
                <div className="text-xl flex flex-col justify-center h-full">
                    {user.firstName[0]}
                </div>
            </div>
            <div className="flex flex-col justify-center h-full">
                <div>
                    {user.firstName} {user.lastName}
                </div>
            </div>
        </div>
        <div className="flex flex-col justify-center h-full">
            <Button label={"Send Money"} />
        </div>
    </div>
}