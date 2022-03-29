const url = 'http://localhost:8080/api/users'

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
    console.log('refresh table')
    const elementUsersTBody = document.getElementById('usersTBody')
    let listUsers = ''

    await fetch(url)
        .then(response => response.json())
        .then(users => users.forEach(user => {
                listUsers += `
                <tr>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.email}</td>
                    <td>${user.roles.map(r => " " + r.role).map(name => name.replace("ROLE_", ""))}</td>
                    <td><a class="btn btn-info" data-toggle="modal" id="${user.id}" onclick="fillEditModalField(${user.id})" href="#editUser">Edit</a></td>
                    <td><a class="btn btn-danger" data-toggle="modal" id="${user.id}" onclick="fillDeleteModalField(${user.id})" href="#deleteUser">Delete</a></td>
                </tr>`
            }))
    elementUsersTBody.innerHTML = listUsers
}

function navbar(){
    const elementNavbar = document.getElementById('Navbar')

    fetch(url + '/authUser')
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
            let objectRoles =
                {
                    role: stringRoles[i].value
                }
            user.roles.push(objectRoles)
        }
    }

    await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(user)
    });
    $('#editUser').modal('hide');
    await getUsers()
}

async function deleteUser(id) {
    await fetch(url + '/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(id)
    });
    $('#deleteUser').modal('hide');
    await getUsers()
}

function fillEditModalField(id) {
    fetch(url + '/' + id)
        .then(response => response.json())
        .then(user => {
            document.getElementById('idEdit').value = user.id
            document.getElementById('firstNameEdit').value = user.firstName
            document.getElementById('lastNameEdit').value = user.lastName
            document.getElementById('emailEdit').value = user.email
            document.getElementById('modalEditButton').addEventListener('click', () => editUser(user.id))
        })
}

function fillDeleteModalField(id) {
    fetch(url + '/' + id)
        .then(response => response.json())
        .then(user => {
            document.getElementById('idDelete').value = user.id
            document.getElementById('firstNameDelete').value = user.firstName
            document.getElementById('lastNameDelete').value = user.lastName
            document.getElementById('emailDelete').value = user.email
            document.getElementById('modalDeleteButton').addEventListener('click', () => deleteUser(user.id))
        })
}