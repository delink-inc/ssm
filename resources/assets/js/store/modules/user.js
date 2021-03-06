import { login, logout, getInfo } from '../../api/login'
import { getToken, setToken, removeToken } from '../../utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.username = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_SCHOOL: (state, school) => {
      state.school = school
    },
    SET_CLASSES: (state, classes) => {
      state.classes = classes
    },
    SET_TEACHERS: (state, teachers) => {
      state.teachers = teachers
    },
    SET_STUDENTS: (state, students) => {
      state.students = students
    },
    SET_USERS: (state, users) => {
      state.users = users
    }
  },

  actions: {
    // login
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // get user information
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          commit('SET_ROLES', data.user.roles)
          commit('SET_NAME', data.user.username)
          commit('SET_AVATAR', data.user.avatar)

          // set school info
          commit('SET_SCHOOL', data.schInfo.school[0])
          commit('SET_CLASSES', data.schInfo.classes)
          commit('SET_TEACHERS', data.schInfo.teachers)
          commit('SET_STUDENTS', data.schInfo.students)
          commit('SET_USERS', data.schInfo.users)

          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // logout
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        // TODO: uncomment once you figure out how to logout from server via api
        // logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        // }).catch(error => {
        //   reject(error)
        // })
      })
    },

    // front end
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
