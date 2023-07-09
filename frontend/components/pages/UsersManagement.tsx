// responsive table of users of type User with a button to delete the user and a button to approve the user
// and a search bar to search for users by username or email or first name or last name
// and pagination to show 10 users per page
import { Principal } from "@dfinity/principal"
import { UserType } from "../../declarations/crud_canister/crud_canister.did"
import { useAuthClient } from "../../Hooks/UseAuthClient"
import React, { useCallback, useContext, useEffect, useState } from "react"
import { toast } from "react-toastify"
import TextInput from "../Inputs/Text"
import { AppContext } from "../../App"
import { useNavigate } from "react-router-dom"

export const UsersManagement = () => {
  // const { actor, isAuthenticated, user, isOwner } = useAuthClient()
  const { actor, isAuthenticated, user, isOwner } = useContext(AppContext)
  const navigate = useNavigate()
  useEffect(() => {
    ;(async () => {
      const checkOwner = await isOwner()

      if (!checkOwner) {
        if (!user) {
          navigate("/auth/complete-profile")
        }

        navigate("/profile")
      }
    })()
  }, [])
  console.log("useAuthContext Values: ", {
    actor,
    isAuthenticated,
    user,
    isOwner,
  })
  // console.log("App context:", {
  //   appContext,
  // })

  const [users, setUsers] = useState<UserType[] | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [filteredUsers, setFilteredUsers] = useState(users)
  const [usersPerPage, setUsersPerPage] = useState(10)
  const [pages, setPages] = useState(1)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [refetch, setRefetch] = useState(false)
  const [approved, setApproved] = useState(false)

  const fetchUsers = useCallback(() => {
    if (!actor) return
    actor
      .readAll()
      .then((users) => {
        console.log({ users })
        // users.ok or empty array
        const usersArray = users["ok"].map((user) => user.data)
        setUsers(usersArray)
        setFilteredUsers(usersArray)
        setPages(Math.ceil(usersArray.length / usersPerPage))
      })
      .catch((err) => {
        toast.error("failed to fetch users")
        console.log(err)
      })
  }, [actor])

  useEffect(() => {
    fetchUsers()
  }, [user, isAuthenticated, page,  isApproving, isDeleting, refetch])

  const handleDelete = (id: Principal) => {
    setIsDeleting(true)
    actor
      .delete(id)
      .then(() => {
        toast.success("user deleted successfully")
        setIsDeleting(false)
      })
      .catch((err) => {
        toast.error("failed to delete user")
        setIsDeleting(false)
      })
  }

  const handleApprove = (id: Principal) => {
    setIsApproving(true)
    actor
      .approve(id)
      .then((data) => {
        console.log({ data })
        if ("err" in data) {
          toast.error("Not Authorized to approved")
          setIsApproving(false)
        } else {
          toast.success("user approved successfully")
          setIsApproving(true)
          setRefetch(!refetch)
        }

        // toast.success('user approved successfully');
        // setIsApproving(false);
      })
      .catch((err) => {
        toast.error("failed to approve user")
        setIsApproving(false)
      })
  }

  const handleSearch = (e: any) => {
    const value = e.target.value
    setSearch(value)
    if (value === "") {
      setFilteredUsers(users)
      return
    }
    const filtered = users?.filter((user) => {
      return (
        user.username.toLowerCase().includes(value.toLowerCase()) ||
        user.email.toLowerCase().includes(value.toLowerCase()) ||
        user.firstName.toLowerCase().includes(value.toLowerCase()) ||
        user.lastName.toLowerCase().includes(value.toLowerCase())
      )
    })
    setFilteredUsers(filtered)
  }

  const handlePageChange = (e: any) => {
    const value = e.target.value
    setPage(value)
  }

  const handleUsersPerPageChange = (e: any) => {
    const value = e.target.value
    setUsersPerPage(value)
    setPages(Math.ceil(users?.length / value))
  }

  return (
    <div className="flex flex-col justify-center max-w-full md:mx-8 mx-2 min-h-[calc(100vh-100px)]">
      <div className="flex w-full gap-4 items-center">
        <div className="w-96">
          <TextInput label="Search" onChange={handleSearch} isTransperant/>
        </div>
        <div className="flex items-center">
        <input
            type="checkbox"
            name="approved"
            id="approved"
            className="mr-2"
            onChange={() => setApproved(!approved)}
            checked={approved}
          />
          <label htmlFor="approved" className="text-accent">Approved</label>
          
          </div>
      </div>
      <table
  
        className="table table-striped table-hover text-sm my-8 border text-accent border-accent general-container"
      >
        <thead className="border text-center bg-secondary text-black">
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Role</th>
            <th>Approval</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {!users && (
            <tr className="border-b-2">
              <td colSpan={7}>
                <div className="p-y-2">loading</div>
              </td>
            </tr>
          )}
          {users && !filteredUsers.length && (
            <tr className="border-b-2">
              <td colSpan={7}>
                <div className="p-y-2">No users found</div>
              </td>
            </tr>
          )}
          {filteredUsers?.filter((user) => {
            if (approved) {
              return user.isApproved
            } else {
              return true
            }
          })
            ?.slice((page - 1) * usersPerPage, page * usersPerPage)
            .map((user) => {
              return (
                <tr className="border-b-2" key={user.id.toText()}>
                  <td>
                    <div className="p-y-2">{user.username}</div>
                  </td>
                  <td>
                    <div className="p-y-2">{user.email}</div>
                  </td>
                  <td>
                    <div className="p-y-2">{user.firstName}</div>
                  </td>
                  <td>
                    <div className="p-y-2">{user.lastName}</div>
                  </td>
                  <td>
                    <div className="p-y-2">
                      {user.isCreator ? "Creator" : "user"}
                    </div>
                  </td>
                  <td>
                    <div className="p-y-2">
                      {user.isApproved ? "Approved" : "Waiting for Approval"}
                    </div>
                  </td>
                  <td>
                    <div className="p-y-2">
                      {user.isApproved === false && (
                        <button
                          style={{
                            padding: ".125rem 1rem",
                            borderRadius: "4px",
                          }}
                          className="bg-primary btn btn-success btn-sm mr-3"
                          onClick={() => handleApprove(user.id)}
                        >
                          Approve
                        </button>
                      )}
                      {
                        <button
                          style={{
                            padding: ".125rem 1rem",
                            borderRadius: "4px",
                          }}
                          className="bg-red-700 btn btn-danger btn-sm"
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </button>
                      }
                    </div>
                  </td>
                </tr>
              )
            })}
          {/* in case there is less items in filtered Users than 10 we need to add blank rows to account for difference */}

          {filteredUsers?.length < 10 &&
            Array.from(Array(10 - filteredUsers?.length).keys()).map((i) => {
              return (
                <tr key={i}>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              )
            })}
        </tbody>
      </table>
      <div className="flex justify-between text-center">
        <div className="form-group">
        <select
            className="form-control bg-secondary  rounded mr-1"
            id="usersPerPage"
            onChange={handleUsersPerPageChange}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
          </select>
          <label className="text-accent" htmlFor="usersPerPage">
            Users per page
          </label>
        </div>
        <div className="form-group">
          <label
           className="text-accent"
            htmlFor="page"
          >
            Page
          </label>
          <select
            className="form-control bg-secondary rounded ml-1"
            id="page"
            onChange={handlePageChange}
          >
            {Array.from(Array(pages).keys()).map((page) => {
              return (
                <option value={page + 1} key={page + 1}>
                  {page + 1}
                </option>
              )
            })}
          </select>
        </div>
      </div>
    </div>
  )
}
