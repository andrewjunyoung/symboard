# Keyboard Layout Installer

A simple, user-friendly wizard for installing custom keyboard layouts (.keylayout files) on macOS and Windows.

## Features

- Simple, intuitive interface for non-technical users
- Step-by-step installation process
- Support for macOS .keylayout files
- Detailed instructions for manual installation when needed

## For Developers

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Setup

1. Clone the repository:

    ```
    git clone https://github.com/yourusername/keyboard-layout-installer.git
    cd keyboard-layout-installer
    ```

2. Install dependencies:

    ```
    npm install
    ```

3. Run the application in development mode:
    ```
    npm start
    ```

### Building for Distribution

To build the application for distribution:

- For macOS:

    ```
    npm run build:mac
    ```

- For Windows:
    ```
    npm run build:win
    ```

The built applications will be available in the `dist` folder.

## Technical Details

### macOS Installation

On macOS, the installer copies the .keylayout file to the user's `~/Library/Keyboard Layouts/` directory. After installation, users need to:

1. Log out and log back in
2. Go to System Preferences > Keyboard > Input Sources
3. Click the + button and find their keyboard layout
4. Select it and click Add

### Windows Installation

Full Windows support is still in development. The current version provides users with manual installation instructions.

## Project Structure

- `main.js` - Electron main process
- `index.html` - User interface
- `package.json` - Project configuration

## How to Include Your Keyboard Layout

To include your keyboard layout with the installer:

1. Place your .keylayout file in a directory accessible to users
2. Users will select this file during the installation process

Alternatively, you can modify the installer to include specific keyboard layouts in the distributed application.

## Customization

You can customize the installer by:

1. Modifying the UI in `index.html`
2. Adding additional platform support in `main.js`
3. Including specific keyboard layouts in the build

## License

This project is licensed under the MIT License - see the LICENSE file for details.
