import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { push } from 'react-router-redux';

import BasicButton from 'components/elements/basic-button';
import SideNav from 'components/widgets/side-nav';
import { postActions } from 'controllers/actions/event';
import { getSelectedPost } from 'controllers/selectors/post';

import immutableToJS from 'utils/components/immutable-to-js';

export class Page extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    // TODO: use flow-type to refactor this
    postList: PropTypes.arrayOf(PropTypes.string),
    posts: PropTypes.objectOf(
      PropTypes.shape({
        title: PropTypes.string,
        body: PropTypes.string,
        comments: PropTypes.arrayOf(PropTypes.string),
      }),
    ),
    selectedPost: PropTypes.shape({
      title: PropTypes.string,
      body: PropTypes.string,
      comments: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          content: PropTypes.string,
          author: PropTypes.shape({
            name: PropTypes.string,
          }),
        }),
      ),
    }),
    navigate: PropTypes.func,
    get: PropTypes.func,
    select: PropTypes.func,
  };

  static defaultProps = {
    postList: [],
    posts: {},
    selectedPost: {
      title: '',
      body: '',
      comments: [],
    },
  };

  render() {
    const { className, postList, posts, selectedPost } = this.props;
    const { navigate, get, select } = this.props;
    return (
      <div className={className}>
        <BasicButton
          className="navButton"
          func={() => navigate('/')}
          text="Back to Index"
        />
        <BasicButton className="actionButton" func={get} text="Get Post List" />
        <div className="contentView">
          <SideNav
            className="titles"
            list={postList.map(id => ({ id, value: posts[id].title }))}
            func={select}
          />
          <div className="postContent">
            <div className="title">{selectedPost.title}</div>
            <div className="body">{selectedPost.body}</div>
          </div>
          <div className="comments">
            {selectedPost.comments.length ? (
              <div className="title">Comments</div>
            ) : null}
            <div className="body">
              {selectedPost.comments.map(({ _id, content, author }) => (
                <div key={_id} className="comment">
                  <div className="author">{author.name}:</div>
                  <div className="content">{content}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  postList: state.event.getIn(['post', 'normalized', 'result']),
  posts: state.event.getIn(['post', 'normalized', 'entities', 'posts']),
  comments: state.event.getIn(['post', 'normalized', 'entities', 'comments']),
  authors: state.event.getIn(['post', 'normalized', 'entities', 'authors']),
  // TODO: how to optimise the performance hit here? as change in immutable props to js will lead to re-render
  selectedPost: getSelectedPost(state),
});

const mapDispatchToProps = dispatch => ({
  navigate: location => dispatch(push(location)),
  get: () => dispatch(postActions.get()),
  select: id => dispatch(postActions.select(id)),
});

const component = styled(Page)`
  width: 640px;
  margin: 240px auto;
  font-family: 'Helvetica';
  line-height: 30px;

  .actionButton {
    background: lightblue;
    color: white;
  }

  .titles {
    display: inline-block;
    float: left;
    width: 120px;
  }

  .postContent {
    display: inline-block;
    float: left;
    width: 320px;
    margin: 20px;
    font-size: 14px;

    .title {
      font-weight: bold;
      line-height: 40px;
    }
  }

  .comments {
    margin-top: 20px;
    display: inline-block;
    float: left;
    width: 160px;
    font-size: 14px;

    .title {
      color: grey;
      line-height: 40px;
    }

    .comment {
      border-top: 1px solid lightgrey;
      padding: 5px 0;
      font-size: 13px;

      .author {
        color: darkgrey;
      }

      .content {
        color: grey;
      }
    }
  }
`;

export default connect(mapStateToProps, mapDispatchToProps)(
  immutableToJS(component),
);
