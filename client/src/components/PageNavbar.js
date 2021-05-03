import React from 'react';
import Nav from 'react-bootstrap/Nav';

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
			<Nav activeKey={activeKey}>
				<Nav.Item><Nav.Link href="/">moment.fm</Nav.Link></Nav.Item>
			  {this.state.navDivs}
      </Nav>
    );
	};
};