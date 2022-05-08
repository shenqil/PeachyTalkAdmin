import {
  Module, ActionTree, MutationTree, GetterTree,
} from 'vuex';

export interface ICommState {
  fileServer: string
}
const state: ICommState = {
  fileServer: `${window.location.origin}/files/files/`,
};

const mutations: MutationTree<ICommState> = {

};

const actions: ActionTree<ICommState, any> = {

};

const getters: GetterTree<ICommState, any> = {

};

const stroe: Module<ICommState, any> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

export default stroe;
