import mirror, { actions } from "mirrorx";
import { isSameDate } from "../utils/date";

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

      const byDates = (acc, [key, value]) => {
        if (state.selectedDate) {
          const events = value.events.filter(event =>
            isSameDate(state.selectedDate, new Date(event.time))
          );
          acc[key] = { ...value, events };
        } else {
          acc[key] = value;
        }

        return acc;
      };

      if (state.filteredData) {
        let filteredData = Object.entries(state.data).reduce(byGroups, {});
        filteredData = Object.entries(filteredData).reduce(byDates, {});
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
    async addMeetups() {
      const groups = {
        ReactNYC: "React NYC",
        vueJsNYC: "Vue NYC",
        AngularNYC: "Angular NYC",
        QueensJS: "Queens JS",
        "NYC-JavaScript-Flatiron": "NYC JavaScript @ Flatiron",
        "NY-JavaScript": "NY JavaScript"
      };
      const groupNames = Object.keys(groups).map(_ => _);

      // reactnyc,vueJsNYC,NYC-JavaScript-Flatiron,NY-JavaScript,AngularNYC,QueensJS,JS-NY
      // prettier-ignore
      const url = `https://nycjs-meetup-server.herokuapp.com/groups/${groupNames.join(',')}`;
      console.log(`addMeetups.url`, url);
      fetch(url)
        .then(_ => _.json())
        .then(data => {
          actions.app.addGroups(groups);
          actions.app.addData(data);
          actions.app.filterData();
        })
        .catch(err => console.log(err));
    }
  }
});
