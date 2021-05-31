/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is part of the Convergence Server, which is released under
 * the terms of the GNU General Public License version 3 (GPLv3). A copy
 * of the GPLv3 should have been provided along with this file, typically
 * located in the "LICENSE" file, which is part of this source code package.
 * Alternatively, see <https://www.gnu.org/licenses/gpl-3.0.html> for the
 * full text of the GPLv3 license, if it was not provided.
 */

import * as React from 'react';
import {ReactNode} from 'react';
import {Button, Col, Form, FormInstance, Input, Row} from "antd";
import {PromiseSubscription} from "../../../utils/make-cancelable";
import {PasswordFormValidator} from "../../../utils/PasswordFormValidator";
import {PasswordConfig} from "../../../models/PasswordConfig";
import {FormButtonBar} from "../FormButtonBar/";


interface SetPasswordProps {
  passwordConfig: PasswordConfig;

  onSetPassword(password: string): Promise<boolean>;

  onCancel?: () => void;
  showCancel?: boolean;
  okButtonText?: string;
}

interface InjectedProps extends SetPasswordProps {

}

interface ChangePasswordFormState {
  confirmDirty: boolean;
}

export class SetPasswordForm extends React.Component<InjectedProps, ChangePasswordFormState> {

  private _configSubscription: PromiseSubscription | null;
  private _passwordValidator = new PasswordFormValidator();
  private _formRef = React.createRef<FormInstance>();

  constructor(props: InjectedProps) {
    super(props);

    this.state = {
      confirmDirty: false
    };

    this._configSubscription = null;
  }

  public render(): ReactNode {
    return (
        <Form ref={this._formRef} onFinish={this._handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="password"
                         label="Password"
                         rules={[
                           {required: true, message: 'Please input a password!'},
                           {validator: this._compareToConfirm}
                         ]}
              >
                <Input type="password"/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="confirm"
                         label="Confirm Password"
                         rules={[
                           {required: true, message: 'Please confirm the password!'},
                           {validator: this._compareToPassword}
                         ]}
              >
                <Input type="password" onBlur={this._handleConfirmBlur}/>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormButtonBar>
                {this.props.showCancel ? <Button htmlType="button" onClick={this._handleCancel}>Cancel</Button> : null}
                <Button type="primary" htmlType="submit">Set Password</Button>
              </FormButtonBar>
            </Col>
          </Row>
        </Form>
    );
  }

  private _handleCancel = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }

  private _handleSubmit = () => {
    this._formRef.current!.validateFields().then(values => {
        const {password} = values;
        this.props.onSetPassword(password).then(clear => {
          if (clear) {
            this._formRef.current!.setFieldsValue({
              password: "",
              confirm: ""
            });
          }
        });
    });
  }

  private _handleConfirmBlur = (e: any) => {
    const value = e.target.value;
    this.setState({confirmDirty: this.state.confirmDirty || !!value});
  }

  private _compareToPassword = (rule: any, value: any, callback: (error?: string) => void) => {
    if (value && value !== this._formRef.current!.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }

  private _compareToConfirm = (rule: any, value: any, callback: (error?: string) => void) => {
    if (this._passwordValidator.validatePassword(this.props.passwordConfig, value, callback)) {
      const form = this._formRef.current!;
      if (value && this.state.confirmDirty) {
        form.validateFields(['confirm']).catch(e => console.error(e));
      }
      callback();
    }
  }
}
