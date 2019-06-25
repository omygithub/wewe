import dayjs from 'dayjs';
import Head from './components/Head';
import Nav from './components/Nav';
import Footer from './components/Footer';
import ChatTabs from './components/ChatTabs';
import ChatHero from './components/ChatHero';
import AdCard from './components/AdCard';

import './topics.scss';

const TopicList = ({ topics, groupName }) => topics.map(topic => (
  <div className="topic-level media">
    <div className="media-content">
      <div className="content">
        <a href={`/chat/${groupName}/topic/${topic.id}`}><strong>{topic.title}</strong></a>
        <br />
        <small>
          #
          {topic.id}
          {' '}
          collected on
          {' '}
          {dayjs((Number(topic.date))).format('YYYY-MM-DD')}
          {' '}
          by
          {' '}
          {topic.from}
        </small>
      </div>
    </div>
    <div className="media-right">
      <a href={`/chat/${groupName}/topic/${topic.id}`}>
        <span className="icon">
          <i className="far fa-comment" />
        </span>
        <small>{topic.msgRange[1] - topic.msgRange[0]}</small>
      </a>
    </div>
  </div>

));

const Index = (props) => {
  const {
    group, topics,
  } = props;

  console.log(topics);
  return (
    <div>
      <Head title={group.name} description={group.description} />
      <Nav />
      <div className="topics-section section">
        <div className="container">
          <div className="columns">
            <div className="column is-four-fifths ">
              <ChatHero groupName={group.name} groupDesc={group.description} />
              <ChatTabs groupName={group.name} focusedTab="topics" />
              <TopicList topics={topics} groupName={group.name} />
            </div>
            <div className="column">
              <AdCard />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

// load data from server (or in browser if nav using Link)
// ref: https://stackoverflow.com/a/52136943/4674834
Index.getInitialProps = async ({
  query: {
    group, topics,
  },
}) => ({
  group, topics,
});

export default Index;
