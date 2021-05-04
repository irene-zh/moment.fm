import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar'

export default class PageNavbar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			navDivs: []
		};
	};

	componentDidMount() {
		const pageList = ['Explore', 'Profile'];

		let navbarDivs = pageList.map((page, i) => {
			return <Nav.Item key={i}><Nav.Link href={"/" + page}>{page.charAt(0).toUpperCase() + page.substring(1, page.length)}</Nav.Link></Nav.Item> 
		});

		this.setState({
			navDivs: navbarDivs
		});
	};

	render() {
    var activeKey = "/";
		return (
      <Navbar sticky="top" bg="primary" variant="dark" style={{marginBottom: "50px"}}>
			<Nav activeKey={activeKey}>
				<Nav.Item><Nav.Link href="/">moment.fm</Nav.Link></Nav.Item>
			  {this.state.navDivs}
      </Nav>
      </Navbar>
    );
	};
};