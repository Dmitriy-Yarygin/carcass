const styles = theme => ({
  root: {
    width: "100%",
  },
  header: {
    // backgroundColor: "#66bb6a"
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
    color: "inherit"
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
      color: "inherit",
      cursor: "default"
    }
  },
});

export default styles;
