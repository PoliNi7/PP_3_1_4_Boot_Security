const urlUsers = 'http://localhost:8080/api/users'
const urlRoles = 'http://localhost:8080/api/roles'

getUsers()
navbar()

$(document).ready(function() {
    $('#editUser').on('hidden.bs.modal', function() {
        $(':input', this).val('');
    });
    $('#deleteUser').on('hidden.bs.modal', function() {
        $(':input', this).val('');
    });
});

async function getUsers() {
    const elementUsersTBody = document.getElementById('usersTBody')
    let listUsers = ''

    await fetch(urlUsers)
        .then(response => response.json())
        .then(users => users.forEach(user => {
                listUsers += `
                <tr id="rowUser${user.id}">
                    <td id="rowFirstNameUser${user.id}">${user.firstName}</td>
                    <td id="rowLastNameUser${user.id}">${user.lastName}</td>
                    <td id="rowEmailUser${user.id}">${user.email}</td>
                    <td id="rowRolesUser${user.id}">${user.roles.map(r => " " + r.role).map(name => name.replace("ROLE_", ""))}</td>
                    <td><a class="btn btn-info" data-toggle="modal" id="${user.id}" onclick="fillEditModalField(${user.id})" href="#editUser">Edit</a></td>
                    <td><a class="btn btn-danger" data-toggle="modal" id="${user.id}" onclick="fillDeleteModalField(${user.id})" href="#deleteUser">Delete</a></td>
                </tr>`
            }))
    elementUsersTBody.innerHTML = listUsers
}

function navbar(){
    const elementNavbar = document.getElementById('Navbar')

    fetch(urlUsers + '/authUser')
        .then(response => response.json())
        .then(authUser => elementNavbar.textContent = `${authUser.username} with roles: ${authUser.authorities.map(a => a.role).map(name => name.replace("ROLE_", ""))}`)
}

//из полей сделать юзера
async function editUser(id){
    let user =
    {
        id: document.getElementById('idEdit').value,
        firstName: document.getElementById('firstNameEdit').value,
        lastName: document.getElementById('lastNameEdit').value,
        email: document.getElementById('emailEdit').value,
        password: document.getElementById('passwordEdit').value,
        roles: []
    }

    let stringRoles = document.getElementById('roleEdit').getElementsByTagName('option')
    for (let i = 0; i < stringRoles.length; i++) {
        if (stringRoles[i].selected){
            await fetch(urlRoles + '/' + stringRoles[i].value)
                .then(response => response.json())
                .then(role => user.roles.push(role))
        }
    }

    await fetch(urlUsers, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(user)
    });
    $('#editUser').modal('hide');

    await fetch(urlUsers + '/' + id)
        .then(response => response.json())
        .then(user => {
            document.getElementById('rowFirstNameUser' + id).textContent = user.firstName
            document.getElementById('rowLastNameUser' + id).textContente = user.lastName
            document.getElementById('rowEmailUser' + id).textContent = user.email
            document.getElementById('rowRolesUser' + id).textContent = user.roles.map(r => " " + r.role).map(name => name.replace("ROLE_", ""))
        })
}

async function deleteUser(id) {
    await fetch(urlUsers + '/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(id)
    });
    $('#deleteUser').modal('hide');
    await document.getElementById('rowUser' + id).remove()
}

function fillEditModalField(id) {
    let listRoles = ''

    fetch(urlUsers + '/' + id)
        .then(response => response.json())
        .then(async user => {
            document.getElementById('idEdit').value = user.id
            document.getElementById('firstNameEdit').value = user.firstName
            document.getElementById('lastNameEdit').value = user.lastName
            document.getElementById('emailEdit').value = user.email
            await fetch(urlRoles)
                .then(response => response.json())
                .then(roles => roles.forEach(role => {
                    listRoles += `
                        <option value="${role.role}" id="${role.role}">${role.role.replace("ROLE_", "")}</option>`
                }))
            document.getElementById('roleEdit').innerHTML = listRoles
            document.getElementById('modalEditButton').addEventListener('click', () => editUser(user.id))
        })
}

function fillDeleteModalField(id) {
    fetch(urlUsers + '/' + id)
        .then(response => response.json())
        .then(user => {
            document.getElementById('idDelete').value = user.id
            document.getElementById('firstNameDelete').value = user.firstName
            document.getElementById('lastNameDelete').value = user.lastName
            document.getElementById('emailDelete').value = user.email
            document.getElementById('modalDeleteButton').addEventListener('click', () => deleteUser(user.id))
        })
}