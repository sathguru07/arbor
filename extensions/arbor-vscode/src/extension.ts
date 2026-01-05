import * as vscode from 'vscode';
import WebSocket from 'ws';

let ws: WebSocket | null = null;
let statusBarItem: vscode.StatusBarItem;
let spotlightDecorationType: vscode.TextEditorDecorationType;

// Current spotlight state
let currentSpotlightFile: string | null = null;
let currentSpotlightLine: number | null = null;

export function activate(context: vscode.ExtensionContext) {
    console.log('Arbor extension activated');

    // Create status bar item
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = '$(circuit-board) Arbor';
    statusBarItem.tooltip = 'Arbor Logic Forest - Click to connect';
    statusBarItem.command = 'arbor.connect';
    statusBarItem.show();

    // Create spotlight decoration (golden glow effect for AI focus)
    spotlightDecorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(255, 215, 0, 0.15)',
        border: '1px solid rgba(255, 215, 0, 0.5)',
        isWholeLine: true,
        overviewRulerColor: 'gold',
        overviewRulerLane: vscode.OverviewRulerLane.Full,
    });

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('arbor.connect', connectToServer),
        vscode.commands.registerCommand('arbor.showInVisualizer', showInVisualizer),
        vscode.commands.registerCommand('arbor.toggleVisualizer', toggleVisualizer)
    );

    // Auto-connect on startup
    connectToServer();

    context.subscriptions.push(statusBarItem);
}

function connectToServer() {
    const config = vscode.workspace.getConfiguration('arbor');
    const serverUrl = config.get<string>('serverUrl', 'ws://127.0.0.1:8080');

    if (ws && ws.readyState === WebSocket.OPEN) {
        vscode.window.showInformationMessage('Already connected to Arbor server');
        return;
    }

    statusBarItem.text = '$(sync~spin) Arbor';
    statusBarItem.tooltip = 'Connecting...';

    try {
        ws = new WebSocket(serverUrl);

        ws.on('open', () => {
            statusBarItem.text = '$(circuit-board) Arbor';
            statusBarItem.tooltip = 'Connected to Arbor server';
            statusBarItem.backgroundColor = undefined;
            vscode.window.showInformationMessage('Connected to Arbor Logic Forest');
        });

        ws.on('message', (data: Buffer) => {
            try {
                const message = JSON.parse(data.toString());
                handleServerMessage(message);
            } catch (e) {
                console.error('Failed to parse Arbor message:', e);
            }
        });

        ws.on('close', () => {
            statusBarItem.text = '$(debug-disconnect) Arbor';
            statusBarItem.tooltip = 'Disconnected - Click to reconnect';
            ws = null;
            clearSpotlight();
        });

        ws.on('error', (err) => {
            console.error('Arbor WebSocket error:', err);
            statusBarItem.text = '$(error) Arbor';
            statusBarItem.tooltip = `Error: ${err.message}`;
        });
    } catch (err: any) {
        vscode.window.showErrorMessage(`Failed to connect to Arbor: ${err.message}`);
    }
}

function handleServerMessage(message: any) {
    if (message.type === 'FocusNode') {
        const payload = message.payload;
        if (payload.file && payload.line !== undefined) {
            highlightSpotlight(payload.file, payload.line);
        }
    }
}

async function highlightSpotlight(filePath: string, line: number) {
    currentSpotlightFile = filePath;
    currentSpotlightLine = line;

    // Try to find and open the file
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) return;

    // Search for the file in workspace
    const files = await vscode.workspace.findFiles(`**/${filePath.split(/[\\/]/).pop()}`);
    if (files.length === 0) return;

    const document = await vscode.workspace.openTextDocument(files[0]);
    const editor = await vscode.window.showTextDocument(document, { preview: true });

    // Highlight the line
    const lineIndex = Math.max(0, line - 1);
    const range = new vscode.Range(lineIndex, 0, lineIndex, Number.MAX_VALUE);

    editor.setDecorations(spotlightDecorationType, [range]);

    // Scroll to the line
    editor.revealRange(range, vscode.TextEditorRevealType.InCenter);

    // Clear highlight after 3 seconds
    setTimeout(() => {
        if (currentSpotlightLine === line && currentSpotlightFile === filePath) {
            clearSpotlight();
        }
    }, 3000);
}

function clearSpotlight() {
    currentSpotlightFile = null;
    currentSpotlightLine = null;

    vscode.window.visibleTextEditors.forEach(editor => {
        editor.setDecorations(spotlightDecorationType, []);
    });
}

async function showInVisualizer() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showWarningMessage('No active editor');
        return;
    }

    const document = editor.document;
    const position = editor.selection.active;
    const line = position.line + 1;
    const fileName = document.fileName;

    if (ws && ws.readyState === WebSocket.OPEN) {
        // Send request to focus this location in visualizer
        const request = {
            jsonrpc: '2.0',
            method: 'spotlight.focus',
            params: {
                file: fileName,
                line: line
            },
            id: Date.now()
        };
        ws.send(JSON.stringify(request));
        vscode.window.showInformationMessage(`Showing ${fileName}:${line} in Arbor`);
    } else {
        vscode.window.showWarningMessage('Not connected to Arbor server');
    }
}

async function toggleVisualizer() {
    // Open terminal and run arbor viz in the workspace
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showWarningMessage('No workspace folder open');
        return;
    }

    const terminal = vscode.window.createTerminal({
        name: 'Arbor Visualizer',
        cwd: workspaceFolders[0].uri.fsPath
    });
    terminal.show();
    terminal.sendText('arbor viz');
    vscode.window.showInformationMessage('Launching Arbor Visualizer...');
}

export function deactivate() {
    if (ws) {
        ws.close();
    }
}
