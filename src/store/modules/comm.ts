import { Module, ActionTree, MutationTree, GetterTree } from 'vuex'


export interface IDemoState {
    fileServer: string
}
const state: IDemoState = {
    fileServer: `${window.location.origin}/files/files/`
}

const mutations: MutationTree<IDemoState> = {

}

const actions: ActionTree<IDemoState, any> = {

}

const getters: GetterTree<IDemoState, any> = {

}

const stroe: Module<IDemoState, any> = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};

export default stroe