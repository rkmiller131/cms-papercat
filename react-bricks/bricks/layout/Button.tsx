import React from 'react'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faCircleDown } from '@fortawesome/free-solid-svg-icons'
import { Text, Link, File, types, useAdminContext } from 'react-bricks/frontend'

import styles from '../../../css/Button.module.css';
import footerOverride from '../../../css/FooterBtnOverride.module.css';

export interface ButtonProps {
  icon?: string
  href?: string
  className?: string
  isTargetBlank?: boolean
  text?: string
  form: boolean
  buttonType: 'submit' | 'link' | 'download' | 'button'
  type: 'button' | 'submit'
  size: 'normal' | 'small'
}

const Button: types.Brick<ButtonProps> = ({
  icon,
  href,
  className,
  isTargetBlank,
  text,
  form,
  buttonType,
  type,
  size
}) => {
  const target = isTargetBlank ?
  { target: '_blank', rel: 'noopener noreferrer' }
  : {}

  let iconSymbol;
  switch(icon) {
    case 'send':
      iconSymbol = <FontAwesomeIcon icon={faPaperPlane} style={{ color: '#F5647F', marginRight: '0.5rem'}}/>;
      break;
    case 'download':
      iconSymbol = <FontAwesomeIcon icon={faCircleDown} style={{ color: '#F5647F', marginRight: '0.5rem'}}/>;
      break;
    case 'steam':
      const iconSize = size === 'small' ? '0.875rem' : '1rem';
      iconSymbol =
      <img
        src='/assets/steamLogo.png'
        alt='Steam Logo'
        style={{height: iconSize, width: iconSize, marginRight: '0.5rem'}}
      />;
      break;
    default:
      iconSymbol = '';
  }

  // Hyperlink Button
  if (buttonType === 'link') {
    return (
      <Link
        href={href}
        {...target}
        className={classNames(
          styles.button,
          size === 'small' ? styles.buttonPsmall : styles.buttonPnormal,
          styles.hyperlinkButton,
          className,
          { [footerOverride.footerBtn]: className === 'footerBtn' }, // apply override only if class = 'footerBtn'
        )}
        type='button'
      >
        {iconSymbol && iconSymbol}
        { text ? text :
          <Text
            propName="text"
            placeholder=""
            renderBlock={({ children }) => <span>{children}</span>}
          />
        }
      </Link>
    );
  }

  // Download Press Kit (Only pdf or rtf documents, no zip file support from bricks, unfortunately)
  if(buttonType === 'download') {
    return (
      <File
        propName='document'
        allowedExtensions={['.pdf', '.rtf']}
        renderBlock={(file) => {
          return file ? (
            <a
              href={file.url}
              download
              className={classNames(
                styles.button,
                size === 'small' ? styles.buttonPsmall : styles.buttonPnormal,
                styles.hyperlinkButton,
                className,
                { [footerOverride.footerBtn]: className === 'footerBtn' }, // apply override only if class = 'footerBtn'
              )}
            >
              {iconSymbol && iconSymbol}
              <Text
                propName="text"
                placeholder=""
                renderBlock={({ children }) => <span>{children}</span>}
              />
            </a>
          ) :
          (
            <span className={styles.uploadInstr}>Upload a pdf or rtf document</span>
          )
        }}
      />
    );
  }

  // Regular Button Default or Contact Form Submission Button
  const { isAdmin, previewMode } = useAdminContext();

  return (
    <button
      type={isAdmin && !previewMode ? 'button' : type}
      className={classNames(
        styles.button,
        size === 'small' ? styles.buttonPsmall : styles.buttonPnormal,
        form ? styles.contactBtn : '',
        className,
        { [footerOverride.footerBtn]: className === 'footerBtn' } // apply override only if class = 'footerBtn'
      )}
      form={form ? 'contact-form' : undefined}
    >
      {iconSymbol && iconSymbol}
      {text ? text :
        <Text
          propName="text"
          placeholder=""
          renderBlock={({ children }) => <span>{children}</span>}
        />
      }
    </button>
  );
}

Button.schema = {
  name: 'button',
  label: 'Button',
  category: 'shared',
  getDefaultProps: () => ({
    buttonType: 'link',
    text: 'Buy on Steam',
    href: 'https://store.steampowered.com/app/1919600/Paper_Perjury/',
    icon: 'steam',
    isTargetBlank: true,
    size: 'normal',
    form: true,
  }),
  sideEditProps: [
    {
      groupName: 'Button functionality',
      defaultOpen: true,
      props: [
        {
          name: 'buttonType',
          label: 'Button type',
          type: types.SideEditPropType.Select,
          selectOptions: {
            display: types.OptionsDisplay.Radio,
            options: [
              { value: 'link', label: 'Hyperlink Button' },
              { value: 'submit', label: 'Form Submit' },
              { value: 'download', label: 'Download Zip' },
            ],
          },
        },
        {
          name: 'form',
          label: 'Button submits contact form',
          type: types.SideEditPropType.Boolean,
          show: (props) => props.buttonType === 'submit',
        },
        {
          name: 'href',
          label: 'Link (External URL or /presskit)',
          type: types.SideEditPropType.Text,
          show: (props) => props.buttonType === 'link',
        },
        {
          name: 'isTargetBlank',
          label: 'Open link in new window',
          type: types.SideEditPropType.Boolean,
          show: (props) => props.buttonType === 'link',
        },
      ],
    },
    {
      groupName: 'Visual',
      defaultOpen: true,
      props: [
        {
          name: 'text',
          label: 'Button Text',
          type: types.SideEditPropType.Text,
        },
        {
          name: 'icon',
          label: 'Icon',
          type: types.SideEditPropType.Select,
          selectOptions: {
            display: types.OptionsDisplay.Select,
            options: [
              { value: '', label: 'None' },
              { value: 'send', label: 'Send' },
              { value: 'download', label: 'Download' },
              { value: 'steam', label: 'Steam' },
            ],
          },
        },
        {
          name: 'size',
          label: 'Size',
          type: types.SideEditPropType.Select,
          selectOptions: {
            display: types.OptionsDisplay.Radio,
            options: [
              { value: 'normal', label: 'Normal' },
              { value: 'small', label: 'Small' },
            ],
          },
        },
        {
          name: 'className',
          label: 'Button Class Name',
          type: types.SideEditPropType.Boolean,
          selectOptions: {
            display: types.OptionsDisplay.Select,
            options: [
              { value: '', label: 'Not for a specific section' },
              { value: 'footerBtn', label: 'Footer Section' },
            ]
          }
        }
      ],
    },
  ],
}

export default Button;