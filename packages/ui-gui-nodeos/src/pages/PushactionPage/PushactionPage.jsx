import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  Card, CardBody, CardHeader,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';

import { StandardTemplate } from 'templates';
import { defaultSet } from 'reducers/permission';

const PushactionPage = (props) => {

  const [ isOpenDropDown, toggleDropDown] = useState(false);

  let { permission: { isFetching, data }, defaultSet } = props;
  let { list,defaultId } = data;

  return (
    <StandardTemplate>
      <div className="PushactionPage">
        <Card>
          <CardHeader>
            Push Action Page
          </CardHeader>
          <CardBody>
          </CardBody>
        </Card>

        <Dropdown isOpen={isOpenDropDown} toggle={()=>{toggleDropDown(!isOpenDropDown)}}>
          <DropdownToggle caret>
              { list.map((permission) => defaultId === permission._id && `${permission.account}@${permission.permission}`) }
          </DropdownToggle>
          <DropdownMenu right>
              { list.map((permission)=><DropdownItem key={permission._id} onClick={()=>{ defaultSet(permission._id)}}>{`${permission.account}@${permission.permission}`}</DropdownItem>) }
          </DropdownMenu>
        </Dropdown>
      </div>
    </StandardTemplate>
  );
}

export default connect(
  ({ permission }) => ({
    permission
  }),
  {
    defaultSet,
  }

)(PushactionPage);
