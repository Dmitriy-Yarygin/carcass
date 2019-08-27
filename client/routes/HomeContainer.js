import { connect } from 'react-redux';
import Home from './Home';
// import * as softActions from '../ducks/soft/actions';
// import * as searchActions from '../ducks/search/actions';

const mapStateToProps = state => ({
  // search: state.search,
  // soft: state.soft,
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  // loadSoft: options => dispatch(softActions.loadSoft(options)),
  // softAdd: newSoft => dispatch(softActions.softAdd(newSoft)),
  // softUpdate: newSoft => dispatch(softActions.softUpdate(newSoft)),
  // softDelete: id => dispatch(softActions.softDelete(id)),
  // clearSearch: () => dispatch(searchActions.clearSearch())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
