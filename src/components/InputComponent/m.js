export default {
    control: {
    //   backgroundColor: '#EEEEEE',
      fontSize: 14,
      fontWeight: 'normal',
      
    },
  
    '&multiLine': {
      control: {
        fontFamily: 'monospace',
        minHeight: 63,
      },
      highlighter: {
        padding: 9,
        border: '1px solid transparent',
      },
      input: {
        padding: 9,
        border: '1px solid silver',
      },
    },
  
    '&singleLine': {
      display: 'inline-block',
      width: 180,
  
      highlighter: {
        padding: 1,
        border: '2px inset transparent',
      },
      input: {
        padding: 12,
        // border: '2px inset',
        // padding: "4px",
        backgroundColor: "#EEEEEE",
        borderBottom: "1px solid black",
        position: 'relative',
        fontSize: "16px",
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px",
        
      },
    },
  
    suggestions: {
      list: {
        backgroundColor: 'white',
        border: '1px solid rgba(0,0,0,0.15)',
        fontSize: 14,
      },
      item: {
        padding: '5px 15px',
        borderBottom: '1px solid rgba(0,0,0,0.15)',
        '&focused': {
          backgroundColor: '#cee4e5',
        },
      },
    },
  }