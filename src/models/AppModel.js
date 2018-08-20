import mirror, { actions } from "mirrorx";

export default mirror.model({
  name: "app",
  initialState: {
    selectedGroups: {},
    groups: {},
    data: {},
    date: new Date()
  },
  reducers: {
    onGroupChecked(state, e) {
      const selectedGroups = { ...state.selectedGroups };
      selectedGroups[e.target.name] = !selectedGroups[e.target.name];
      return { ...state, selectedGroups };
    },
    setDate(state, date) {
      return { ...state, date };
    },
    addData(state, data) {
      return { ...state, data };
    },
    addGroups(state, groups) {
      // Initialize all groups as selected by default
      const selectedGroups = Object.keys(groups).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});

      return { ...state, groups, selectedGroups };
    },
    // addSelectedGroups(state, selectedGroups) {
    //   return { ...state, selectedGroups };
    // },
    getData(state) {
      return {
        ...state,
        data: state.data
      };
    },
    getSelectedGroups(state) {
      return {
        ...state,
        selectedGroups: state.selectedGroups
      };
    }
  },
  effects: {
    // https://github.com/mirrorjs/mirror
    async incrementAsync() {
      // await new Promise((resolve, reject) => {
      //   setTimeout(() => {
      //     resolve();
      //   }, 1000);
      // });
      // actions.app.increment();
    }
  }
});
