const urlUsers = 'http://localhost:8080/api/users'

navbarAndUserInfoPage()

function navbarAndUserInfoPage(){
    const elementNavbar = document.getElementById('Navbar')
    const elementUserInfoPage = document.getElementById('userInfoPage')

    fetch(urlUsers + '/authUser')
        .then(response => response.json())
        .then(authUser => {
            elementNavbar.textContent = `${authUser.username} with roles: ${authUser.authorities.map(a => a.role).map(name => name.replace("ROLE_", ""))}`
            elementUserInfoPage.innerHTML = `
                <tr>
                    <td>${authUser.firstName}</td>
                    <td>${authUser.lastName}</td>
                    <td>${authUser.email}</td>
                    <td>${authUser.roles.map(r => " " + r.role).map(name => name.replace("ROLE_", ""))}</td>
                </tr>`
        })
}