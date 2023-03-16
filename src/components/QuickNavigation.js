import React, { Component } from 'react';
import { InfiniteScrollTable, Icon } from '@contentstack/venus-components';
import ContentstackUIExtension from "@contentstack/ui-extensions-sdk";
import { getAllContentTypes } from '../service';


class QuickNavigation extends Component {
  constructor(props) {
    super(props);
    this.extension = {};
    this.stackData = {}
    this.contentstackClient = {}
    this.state = {}
    this.state = {
      contentTypes: "",
      filteredContentType: "",
      filter: "",
      loadTable: false
    };

  }
  componentDidMount() {
    ContentstackUIExtension.init().then((extension) => {
      this.extension = extension
      this.stackData = extension.stack.getData();
      console.log(this.extension, this.stackData)

      getAllContentTypes(this.extension, this.stackData)
        .then((result) => {
          console.log(result)
          var itemObj = {}
          let allContentTypes = result.content_types.map((content_type, index) => {
            console.log("The current iteration is: " + index);

            itemObj[index] = 'loaded'
            return { // Return the new object structure
              name: content_type.title,
              uid: content_type.uid,
            }
          });
          // Log the value
          console.log(allContentTypes, itemObj);

          this.setState({ contentTypes: allContentTypes, filteredContentType: allContentTypes, ItemLoaded: itemObj }, this.autoHeight(extension))

        })
    })
  }
  autoHeight(extension) {
    extension.window.onDashboardResize(() => {
      setTimeout(() => { extension.window.enableAutoResizing(); }, 500);
    });
    extension.window.enableResizing();
  }
  renderData() {
    this.setState({ loadTable: true })
  }

  searchCtype = (e) => {
    console.log(e)
    let filteredData = this.state.contentTypes;
    if (e.searchText.length > 0) {
      const lowercasedFilter = e.searchText.toLowerCase();
      filteredData = this.state.contentTypes.filter(item => {
        return Object.keys(item).some(key =>
          item[key].toLowerCase().includes(lowercasedFilter)
        );
      });
      console.log('Filtered' + filteredData)
    }
    if (e.sortBy) {
      if (e.sortBy.sortingDirection === 'asc') {

        filteredData = filteredData.sort((a, b) => (a[e.sortBy.id] > b[e.sortBy.id]) ? 1 : -1)
      } else {
        filteredData = filteredData.sort((a, b) => (a[e.sortBy.id] < b[e.sortBy.id]) ? 1 : -1)
      }
      console.log('Sorted' + filteredData)
    }

    this.setState({ filteredContentType: filteredData })

  }
  render() {
    const onHoverActionList = [

      {
        label: <Icon icon="PublishIcon" />,
        title: 'Create new Entry',
        action: (event, data) => {
          event.stopPropagation()
          console.log('PublishIcon triggered data', data)
          window.open("https://app.contentstack.com/#!/stack/bltb40c06fccae54e1f/content-type/" + data['uid'] + "/en-us/entry/create");
        },
      },

    ]
    const columns = [
      {
        Header: 'Content Type Name',
        accessor: 'name',
      },
      {
        Header: 'Content Type UID',
        accessor: 'uid',
      },

    ]
    return (
      <div>
        {this.state.contentTypes
          ? <div className="quick-navigation">
            <InfiniteScrollTable
              totalCounts={this.state.contentTypes.length}
              dataType={{ singular: 'item', plural: 'items' }}
              pageCount={10}
              tableHeight={400}
              viewSelector={true} isRowSelect={false} canSearch={true} canRefresh={true}
              searchPlaceholder="Search Content type"
              onHoverActionList={onHoverActionList}
              columnSelector={false}
              data={this.state.filteredContentType}
              fetchTableData={(e) => this.searchCtype(e)}
              loadMoreItems={() => undefined}
              itemStatusMap={this.state.ItemLoaded}
              columns={columns}
              equalWidthColumns={true}
              uniqueKey={'uid'}
            />
          </div> : <div>Loading Content Types...</div>
        }
      </div>
    );
  }
}

export default QuickNavigation;