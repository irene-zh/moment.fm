import React from 'react';
import {
  Container,
  Row,
  Button,
  Card,
  Accordion
} from 'react-bootstrap';

export default class Profile extends React.Component {
	constructor(props) {
		super(props);
    
    this.state = {
      profileDiv: []
    }
	};

	componentDidMount() {
    var profileDiv;
    console.log(this.props.loggedIn);
    if (!this.props.loggedIn) {
      profileDiv = (
        <>
        <Container>
          <h1>&#x1F640;</h1>
          <h1>Oops!</h1>
          <p>Looks like you aren't logged in. Head over to <a href="Login">here</a> to get started.</p>
        </Container>
        </>
      );
    } else {
      const userDiv = (
        <Container>
          <Row>
          <h1>&#x1F64B;</h1>
          <h1>{this.props.username}</h1>
          </Row>
        </Container>
      );
      var friendsDiv, friendsList;

      fetch("http://localhost:8081/user/:" + this.props.username + "/friends",
      {
        method: 'GET' // The type of HTTP request.
      }).then(res => {
        return res.json();
      }, err => {
        console.log(err);
      }).then(userInfo => {
        if (!userInfo) return;

        friendsList = userInfo.map((friend, i) =>
          <Card.Body><a href={"/user/" + friend}>{friend}</a></Card.Body>
        );

        friendsDiv = 
          <Container>
            <Accordion defaultActiveKey="0">
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    {userInfo.friend.length} Friends
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  {friendsList}
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Container>;

        profileDiv = (
          <>
          {userDiv}
          {friendsDiv}
          </>
        );
      }, err => {
        console.log(err);
      });
    }

    this.setState({
      profileDiv: profileDiv});
	};

	render() {
    return this.state.profileDiv;
	};
};
