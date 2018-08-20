import mirror, { actions } from "mirrorx";

const byDates = (key, data) => {
  return true;
};

export default mirror.model({
  name: "app",
  initialState: {
    selectedGroups: {},
    groups: {},
    data: {},
    selectedDate: null,
    filteredData: null
  },
  reducers: {
    filterData(state) {
      const byGroups = (acc, [key, value]) => {
        if (state.selectedGroups[key]) {
          acc[key] = value;
        }
        return acc;
      };

      if (state.filteredData) {
        const filteredData = Object.entries(state.data).reduce(byGroups, {});
        return { ...state, filteredData };
      } else {
        return { ...state, filteredData: state.data };
      }
    },
    getData(state) {
      return {
        ...state,
        data: state.data
      };
    },
    onGroupChecked(state, e) {
      const selectedGroups = { ...state.selectedGroups };
      selectedGroups[e.target.name] = !selectedGroups[e.target.name];
      return { ...state, selectedGroups };
    },
    clearSelectedDate(state) {
      return { ...state, selectedDate: null };
    },
    setSelectedDate(state, selectedDate) {
      return { ...state, selectedDate };
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
