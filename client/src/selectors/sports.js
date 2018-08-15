
export function selectSports(state) {
  return state.entities.sports;
}

export function selectById(state, id) {
  const items = state.entities.sports;
  return items.find(item => item._id == id);
}
