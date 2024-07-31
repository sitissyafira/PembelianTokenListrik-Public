/**
 * @description Will check the role and will return true if the role is including 'spv' 
 * @param none
 * @returns boolean
 */
export default function RoleChecker(name = null) {
  name = typeof name === 'string' && name.toLocaleLowerCase()
  const store = JSON.parse(localStorage.getItem('currentUser'))
  return store
    ? store.role.includes(name)
    : false 
}