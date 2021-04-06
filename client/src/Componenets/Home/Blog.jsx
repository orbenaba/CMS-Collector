import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Hidden from "@material-ui/core/Hidden";

const styles = (theme) => ({
    layout: {
        width: "auto",
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
            width: 1100,
            marginLeft: "auto",
            marginRight: "auto"
        }
    },
    toolbarMain: {
        borderBottom: `1px solid ${theme.palette.grey[300]}`
    },
    toolbarTitle: {
        flex: 1
    },
    toolbarSecondary: {
        justifyContent: "space-between"
    },
    mainFeaturedPost: {
        backgroundColor: theme.palette.grey[800],
        color: theme.palette.common.white,
        marginBottom: theme.spacing.unit * 4
    },
    mainFeaturedPostContent: {
        padding: `${theme.spacing.unit * 6}px`,
        [theme.breakpoints.up("md")]: {
            paddingRight: 0
        }
    },
    mainGrid: {
        marginTop: theme.spacing.unit * 3
    },
    card: {
        display: "flex"
    },
    cardDetails: {
        flex: 1
    },
    cardMedia: {
        width: 160
    },
    markdown: {
        padding: `${theme.spacing.unit * 3}px 0`
    },
    sidebarAboutBox: {
        padding: theme.spacing.unit * 2,
        backgroundColor: theme.palette.grey[200]
    },
    sidebarSection: {
        marginTop: theme.spacing.unit * 3
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        marginTop: theme.spacing.unit * 4,
        padding: `${theme.spacing.unit * 6}px 0`
    }
});

const Authors = [
    {
        creator: "Or Ben-Aba",
        profession: "Low level, Blockchain & FullStack",
        description:
            "This is a wider card with supporting text below as a natural lead-in to additional content."
    },
    {
        creator: "Or Ben-Aba",
        profession: "Low level, Blockchain & FullStack",
        description:
            "This is a wider card with supporting text below as a natural lead-in to additional content."
    }
];


const social = ["GitHub", "Twitter", "Facebook"];

function Blog(props) {
    const { classes } = props;

    return (
        <React.Fragment>
            <CssBaseline />
            <div className={classes.layout} style={{ marginTop: '2rem' }}>
                <main>
                    {/* Main featured post */}
                    <Paper className={classes.mainFeaturedPost}>
                        <Grid container>
                            <Grid item md={6}>
                                <div className={classes.mainFeaturedPostContent}>
                                    <Typography variant="display2" color="inherit" gutterBottom>
                                        Content Mangement System
                                    </Typography>
                                    <Typography variant="headline" color="inherit" paragraph>
                                        Our Application runs at the server side a lot of microserives
                                   </Typography>
                                </div>
                            </Grid>
                        </Grid>
                    </Paper>
                    {/* End main featured post */}
                    {/* Sub featured posts */}
                    <Grid container spacing={40} className={classes.cardGrid}>
                        {Authors.map((author) => (
                            <Grid item key={author.name} xs={12} md={6}>
                                <Card className={classes.card}>
                                    <div className={classes.cardDetails}>
                                        <CardContent>
                                            <Typography variant="headline">{author.creator}</Typography>
                                            <Typography variant="subheading" color="textSecondary">
                                                {author.profession}
                                            </Typography>
                                            <Typography variant="subheading" paragraph>
                                                {author.description}
                                            </Typography>
                                            <Typography variant="subheading" color="primary">
                                                Continue reading...
                                            </Typography>
                                        </CardContent>
                                    </div>
                                    <Hidden xsDown>
                                        <CardMedia
                                            className={classes.cardMedia}
                                            image={null}
                                            title="Image title"
                                        />
                                    </Hidden>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    {/* End sub featured posts */}
                    <Grid container spacing={40} className={classes.mainGrid}>
                        {/* Main content */}
                        {/* End main content */}
                        {/* Sidebar */}
                        <Grid item xs={12} md={4}>
                            <Typography
                                variant="title"
                                gutterBottom
                                className={classes.sidebarSection}
                            >
                                Social
              </Typography>
                            {social.map((network) => (
                                <Typography key={network}>{network}</Typography>
                            ))}
                        </Grid>
                        {/* End sidebar */}
                    </Grid>
                </main>
            </div>
            {/* Footer */}
            <footer className={classes.footer}>
                <Typography variant="title" align="center" gutterBottom>
                    Footer
        </Typography>
                <Typography
                    variant="subheading"
                    align="center"
                    color="textSecondary"
                    component="p"
                >
                    Something here to give the footer a purpose!
        </Typography>
            </footer>
            {/* End footer */}
        </React.Fragment>
    );
}

Blog.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Blog);
