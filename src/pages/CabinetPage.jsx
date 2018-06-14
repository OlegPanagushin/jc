import React from "react";
import PropTypes from "prop-types";
import NavLink from "react-router-dom/NavLink";
import { connect } from "react-redux";
import cn from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import MenuIcon from "@material-ui/icons/Menu";
import Dashboard from "@material-ui/icons/Dashboard";
import ExitToApp from "@material-ui/icons/ExitToApp";
import AccountBox from "@material-ui/icons/AccountBox";
import RecentActors from "@material-ui/icons/RecentActors";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Typography from "@material-ui/core/Typography";
import * as routes from "../constants/routes";
import { logout, getUserProfile } from "../actions";
import ConfirmationDialog from "../components/ConfirmationDialog";

const drawerWidth = 260;

const styles = theme => {
  const unit = theme.spacing.unit;

  return {
    page: {
      display: "flex",
      height: "100%",
      minWidth: 1200,
      width: "100%"
    },
    nav: {
      background: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      height: "100%",
      width: drawerWidth
    },
    textColor: {
      color: theme.palette.primary.contrastText
    },
    link: {
      color: theme.palette.primary.contrastText,
      transition: theme.transitions.create(["background", "color"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      "& h3": {
        color: "inherit"
      }
    },
    currentLink: {
      background: theme.palette.primary.contrastText,
      color: theme.palette.primary.main,
      cursor: "default",
      pointerEvents: "none",
      "&:hover": {
        color: theme.palette.primary.contrastText
      }
    },
    linkIcon: {
      color: "inherit"
    },
    linkText: {
      color: "inherit"
    },
    content: {
      height: "100%",
      paddingTop: 64,
      width: "100%"
    },
    scrollable: {
      height: "100%",
      overflow: "auto",
      padding: `${unit * 3}px`,
      position: "relative"
    },
    avatar: {
      height: 50,
      width: 50,
      transition: theme.transitions.create(["width", "height"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    avatarCondensed: {
      height: "1em",
      width: "1em"
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    menuButton: {
      marginLeft: 12,
      marginRight: 36
    },
    hide: {
      display: "none"
    },
    drawerPaper: {
      overflowX: "hidden",
      position: "relative",
      whiteSpace: "nowrap",
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    drawerPaperClose: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      width: unit * 7,
      [theme.breakpoints.up("sm")]: {
        width: unit * 9
      }
    },
    toolbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 8px",
      ...theme.mixins.toolbar
    }
  };
};

function isAbsoluteUrl(url) {
  if (!url) return false;
  url = url.toLowerCase();
  return url.startsWith("http://") || url.startsWith("https://");
}

class CabinetPage extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    render: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    logout: PropTypes.func.isRequired,
    getUserProfile: PropTypes.func.isRequired,
    avatar: PropTypes.string
  };

  state = {
    drawerOpen: false,
    confirmLogout: false
  };

  handleDrawerOpen = () => {
    this.setState({ drawerOpen: true });
  };

  handleDrawerClose = () => {
    this.setState({ drawerOpen: false });
  };

  requestLogout = () => {
    this.setState({ confirmLogout: true });
  };

  handleConfirmClose = result => {
    this.setState({ confirmLogout: false });
    if (result) this.props.logout();
  };

  componentDidMount() {
    this.props.getUserProfile();
  }

  render() {
    const {
      classes,
      render,
      title,
      firstName,
      instagram_username,
      avatar
    } = this.props;

    const { drawerOpen, confirmLogout } = this.state;

    return (
      <div className={classes.page}>
        <AppBar
          position="absolute"
          className={cn(classes.appBar, drawerOpen && classes.appBarShift)}
        >
          <Toolbar disableGutters={!drawerOpen}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerOpen}
              className={cn(classes.menuButton, drawerOpen && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" noWrap>
              {title}
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: cn(
              classes.drawerPaper,
              !drawerOpen && classes.drawerPaperClose
            )
          }}
          open={drawerOpen}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List component="nav" className={classes.nav}>
            <ListItem className={classes.userInfoBlock}>
              <ListItemIcon>
                {isAbsoluteUrl(avatar) ? (
                  <Avatar
                    alt={firstName}
                    src={avatar}
                    className={cn(
                      classes.textColor,
                      classes.avatar,
                      !drawerOpen && classes.avatarCondensed
                    )}
                  />
                ) : (
                  <AccountBox
                    className={cn(
                      classes.textColor,
                      classes.avatar,
                      !drawerOpen && classes.avatarCondensed
                    )}
                  />
                )}
              </ListItemIcon>
              <ListItemText
                primary={<span className={classes.textColor}>{firstName}</span>}
                secondary={
                  <span className={classes.textColor}>
                    {instagram_username}
                  </span>
                }
              />
            </ListItem>
            <Divider />
            <ListItem
              button
              component={NavLink}
              className={classes.link}
              activeClassName={classes.currentLink}
              exact
              to={routes.DASHBOARD}
            >
              <ListItemIcon>
                <Dashboard className={classes.linkIcon} />
              </ListItemIcon>
              <ListItemText
                primary={<span className={classes.linkText}>Dashboard</span>}
              />
            </ListItem>
            <ListItem
              button
              component={NavLink}
              className={classes.link}
              activeClassName={classes.currentLink}
              to={routes.POSTS}
            >
              <ListItemIcon>
                <RecentActors className={classes.linkIcon} />
              </ListItemIcon>
              <ListItemText
                primary={<span className={classes.linkText}>Posts</span>}
              />
            </ListItem>
            <Divider />
            <ListItem button onClick={this.requestLogout}>
              <ListItemIcon>
                <ExitToApp className={classes.textColor} />
              </ListItemIcon>
              <ListItemText
                primary={<span className={classes.textColor}>Logout</span>}
              />
            </ListItem>
          </List>
        </Drawer>
        <ConfirmationDialog
          title="Logout Confirmation"
          question="Are you sure to logout?"
          open={confirmLogout}
          onClose={this.handleConfirmClose}
        />
        <main className={classes.content}>
          <div className={classes.scrollable}>{render()}</div>
        </main>
      </div>
    );
  }
}

export default connect(
  state => {
    const { firstName, instagram_username, avatar } = state.rootReducer.user;
    return { firstName, instagram_username, avatar };
  },
  dispatch => ({
    logout: () => dispatch(logout()),
    getUserProfile: () => dispatch(getUserProfile())
  })
)(withStyles(styles)(CabinetPage));
