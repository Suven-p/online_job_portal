import {useState, useEffect} from "react"
import {Link, useLocation, Outlet} from "react-router-dom"


function MyProfile() {
    const path = useLocation().pathname
    const [navElements, setNavElements] = useState([
        {
            name: "Avatar",
            to:"avatar",
            status: "" 
        },
        {
            name: "Basics",
            to:"basics",
            status: ""
        },
        {
            name: "Education",
            to:"education",
            status: ""
        },
        {
            name: "Skills",
            to: "skills",
            status: ""
        }]
    )
    function OnClick(e){
        const id = e.target.id
        const updatedNavElements = navElements.map((element) => {
            if (element.status === "table-active"){
                element.status = ""
            }
            if (element.to === id){
                element.status = "table-active"
            }
            return element
        })
        setNavElements(updatedNavElements)
    }
    //set active for initial render
    useEffect(() => {
        const updatedNavElements = navElements.map((element) => {
            if (element.status === "table-active"){
                element.status = ""
            }
            if (path.includes(element.to) ){
                element.status = "table-active"
            }
            return element
        })
        setNavElements(updatedNavElements)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return (
        <div className="editprofile">
            <h1>Edit Profile</h1>
            <div className="bg-light container">
                <div className="row">
                    <div className="col-12 col-lg-3">
                        <table className="table table-hover">
                            <tbody>
                                {navElements.map((element) => {
                                    return(
                                        <tr className="">
                                            <td className={`${element.status}`}>
                                                <Link onClick={OnClick} className={`nav-link link-dark`} to={element.to} id={`${element.to}`}>{element.name}</Link>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="col-12 col-lg-9">
                        <Outlet/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyProfile;